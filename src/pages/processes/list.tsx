import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Select, Space, Table, Tag, Tooltip } from "antd";
import React from "react";
import { ProcessRunButton } from "../../components/process-run-button";
import { LIVE_LIST_QUERY_OPTIONS } from "../../config/query-cache";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

const ACTIVE_RUN_POLL_INTERVAL = 30_000;

const extractProcessRows = (dataOrQuery: any, maybeQuery?: any) => {
  if (Array.isArray(dataOrQuery?.data)) {
    return dataOrQuery.data as Array<{ latest_run?: { status?: string; result?: string } }>;
  }

  if (Array.isArray(maybeQuery?.state?.data?.data)) {
    return maybeQuery.state.data.data as Array<{ latest_run?: { status?: string; result?: string } }>;
  }

  if (Array.isArray(dataOrQuery?.state?.data?.data)) {
    return dataOrQuery.state.data.data as Array<{ latest_run?: { status?: string; result?: string } }>;
  }

  return [];
};

const getRunState = (latestRun?: { status?: string; result?: string }) => {
  const status = latestRun?.status?.toLowerCase();
  const result = latestRun?.result?.toLowerCase();

  if (!status && !result) return "idle";

  if (status === "running" || status === "new") return "running";
  if (status === "error" || result === "failed" || result === "error" || result === "warning") return "failed";
  if (result === "success" || status === "finished") return "success";
  return "idle";
};

export const ProcessList: React.FC<IResourceComponentsProps> = () => {
  const { filters, setFilters, tableQuery, tableProps } = useTable({
    syncWithLocation: true,
    queryOptions: {
      ...LIVE_LIST_QUERY_OPTIONS,
      // Poll only while a visible process is actively running.
      refetchInterval: (dataOrQuery: any, maybeQuery?: any) => {
        const rows = extractProcessRows(dataOrQuery, maybeQuery);
        const hasActiveRun = rows.some((process) => getRunState(process?.latest_run) === "running");

        return hasActiveRun ? ACTIVE_RUN_POLL_INTERVAL : false;
      },
    },
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

  const processes = tableQuery.data;
  const tags: string[] | undefined = processes?.data?.map((f: any) => f.tags).flat();
  const tagSet = [...new Set(tags)].sort();
  const runningCount = processes?.data?.filter((process: any) => getRunState(process?.latest_run) === "running").length ?? 0;
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
    <List>
      <div className="processes-live-hint-wrap">
        <div className="processes-live-hint">Live updates every 30 seconds while runs are active</div>
        {runningCount > 0 && (
          <Tag className="processes-live-counter">
            <span className="processes-live-counter__pulse" />
            {runningCount} running
          </Tag>
        )}
      </div>
      <div className="entity-table-shell entity-table-shell--flat">
        <Table
          className="processes-table"
          {...tableProps}
          pagination={{ ...tableProps.pagination, showSizeChanger: false }}
          rowKey="id"
          rowClassName={(record) => {
            const state = getRunState(
              (record as BaseRecord & { latest_run?: { status?: string; result?: string } }).latest_run
            );

            if (state === "running") return "entity-table-row entity-table-row--running";
            if (state === "failed") return "entity-table-row entity-table-row--failed";

            return "entity-table-row";
          }}
        >
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
        <Table.Column
          dataIndex="description"
          title="Description"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by description" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="tags"
          title="Tags"
          render={(tags: string[]) => (
            <div className="process-tags-wrap">
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
          dataIndex="latest_run"
          title="Latest run"
          render={(latestRun?: { status?: string; result?: string; created_at?: string }) => {
            if (!latestRun) return <span className="run-status-meta">Not run yet</span>;

            const state = getRunState(latestRun);
            const subtitle = latestRun.created_at
              ? `Updated ${new Date(latestRun.created_at).toLocaleString()}`
              : `Status: ${state}`;
            const startedAt = latestRun.created_at ? new Date(latestRun.created_at).getTime() : null;
            const elapsedSeconds = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : null;
            const elapsedLabel =
              elapsedSeconds == null
                ? ""
                : `${Math.floor(elapsedSeconds / 60)}m ${String(elapsedSeconds % 60).padStart(2, "0")}s`;
            const isRunning = state === "running";

            return (
              <div className={`run-status-cell ${isRunning ? "run-status-cell--running" : ""} ${state === "failed" ? "run-status-cell--failed" : ""}`}>
                <Tooltip title={subtitle}>
                  <Tag className={`run-status-chip run-status-chip--${state} ${isRunning ? "run-status-chip--running-strong" : ""}`}>
                    <span className="run-status-chip__content">
                      {isRunning && <span className="run-status-chip__pulse" />}
                      <span>{state}</span>
                    </span>
                  </Tag>
                </Tooltip>
                {isRunning && (
                  <span className="run-status-meta run-status-meta--live">Live refresh{elapsedLabel ? ` for ${elapsedLabel}` : ""}</span>
                )}
              </div>
            );
          }}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space className="entity-table-actions">
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
              <ProcessRunButton hideText buttonProps={{ size: "small", type: "primary" }} recordItemId={record.id} />
            </Space>
          )}
        />
        </Table>
      </div>
    </List>
  );
};
