import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Select, Space, Table, Tag, Tooltip } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router";
import { FileUploadButton, SkeletonList } from "../../components";
import { useFavorites } from "../../hooks/useFavorites";
import { STATIC_QUERY_OPTIONS } from "../../config/query-cache";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

export const FileList: React.FC<IResourceComponentsProps> = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { filters, setFilters, tableQuery, tableProps } = useTable({
    syncWithLocation: true,
    queryOptions: STATIC_QUERY_OPTIONS,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    sorters: {
      initial: [
        {
          field: "code",
          order: "asc",
        },
      ],
    },
  });

  const files = tableQuery.data;
  const tags: string[] | undefined = files?.data?.map((f: any) => f.tags).flat();
  const tagSet = [...new Set(tags)].sort();
  const activeTagFilter = filters.find((filter) => "field" in filter && filter.field === "tags");

  const applyTagFilter = (tag: string) => {
    const nextFilters = filters.filter((filter) => !("field" in filter && filter.field === "tags"));
    const isSameTag = activeTagFilter?.value === tag;

    setFilters(
      isSameTag
        ? nextFilters
        : [
            ...nextFilters,
            {
              field: "tags",
              operator: "eq",
              value: tag,
            },
          ],
      "replace"
    );
  };

  return (
    <List canCreate={true}>
      <div className="entity-table-shell entity-table-shell--flat">
        <SkeletonList loading={tableQuery.isLoading}>
        <Table
          className="files-table"
          {...tableProps}
          pagination={{ ...tableProps.pagination, showSizeChanger: false }}
          rowKey="id"
          rowClassName={() => "entity-table-row"}
          onRow={(record) => ({
            onClick: () => navigate(`/files/show/${record.id}`),
            style: { cursor: "pointer" },
          })}
        >
        <Table.Column
          title=""
          width={40}
          render={(_, record: any) => (
            <Tooltip title={isFavorite("files", record.id) ? "Remove from favorites" : "Add to favorites"}>
              <span
                role="button"
                tabIndex={0}
                aria-label={isFavorite("files", record.id) ? "Remove from favorites" : "Add to favorites"}
                style={{ cursor: "pointer", fontSize: 16 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite("files", record.id, record.code);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite("files", record.id, record.code);
                  }
                }}
              >
                {isFavorite("files", record.id) ? (
                  <StarFilled style={{ color: "#cc8b1f" }} />
                ) : (
                  <StarOutlined style={{ color: "var(--spade-muted)" }} />
                )}
              </span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="code"
          title="Name"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by name" />
            </FilterDropdown>
          )}
        />
        <Table.Column dataIndex="description" title="Description" sorter />{" "}
        <Table.Column
          dataIndex="tags"
          title="Tags"
          render={(tags: string[]) => (
            <div className="file-tags-wrap">
              {tags.map((tag) => (
                <Tag
                  className={`entity-tag entity-tag--interactive ${activeTagFilter?.value === tag ? "entity-tag--active" : ""}`}
                  key={tag}
                  onClick={() => applyTagFilter(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Search tags"
                options={tagSet.map((name) => ({ label: name, value: name }))}
                className="filter-dropdown__select"
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space className="entity-table-actions">
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
              <FileUploadButton hideText buttonProps={{ size: "small", type: "primary" }} recordItemId={record.id} />
            </Space>
          )}
        />
        </Table>
        </SkeletonList>
      </div>
    </List>
  );
};
