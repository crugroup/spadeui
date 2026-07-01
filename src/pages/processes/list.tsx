import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Select, Space, Table, Tag, Tooltip } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import React from "react";
import { ProcessRunButton } from "../../components/process-run-button";
import { SkeletonList } from "../../components";
import { useFavorites } from "../../hooks/useFavorites";
import { API_URL } from "../../config/constants";
import { STATIC_QUERY_OPTIONS } from "../../config/query-cache";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";
import axiosHelper from "../../helpers/axios-token-interceptor";

const ACTIVE_RUN_POLL_INTERVAL = 30_000;

type LatestRun = { status?: string; result?: string; created_at?: string };

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

  const processes = tableQuery.data;
  const [latestRunsByProcessId, setLatestRunsByProcessId] = React.useState<Record<number, LatestRun | undefined>>({});
  const [latestRunsLoaded, setLatestRunsLoaded] = React.useState(false);
  const processIds = (processes?.data ?? []).map((process: any) => process.id).filter(Boolean);
  const processIdsKey = processIds.join(",");
  const tags: string[] | undefined = processes?.data?.map((f: any) => f.tags).flat();
  const tagSet = [...new Set(tags)].sort();
  const runningCount = processIds.filter((id) => getRunState(latestRunsByProcessId[id]) === "running").length;
  const activeTagFilter = filters.find((filter) => "field" in filter && filter.field === "tags");

  React.useEffect(() => {
    let cancelled = false;

    const fetchLatestRuns = async () => {
      if (!processIdsKey) {
        if (!cancelled) {
          setLatestRunsByProcessId({});
          setLatestRunsLoaded(true);
        }
        return;
      }

      try {
        const { data } = await axiosHelper.axiosInstance.get(`${API_URL}/processes/latest_runs`, {
          params: { ids: processIdsKey },
        });

        if (cancelled) return;

        setLatestRunsByProcessId(
          Object.fromEntries(
            (data ?? []).map((item: { process_id: number; latest_run?: LatestRun | null }) => [
              item.process_id,
              item.latest_run ?? undefined,
            ])
          )
        );
        setLatestRunsLoaded(true);
      } catch {
        if (!cancelled) {
          setLatestRunsLoaded(true);
        }
      }
    };

    void fetchLatestRuns();

    return () => {
      cancelled = true;
    };
  }, [processIdsKey, tableQuery.dataUpdatedAt]);

  React.useEffect(() => {
    if (!processIdsKey || runningCount === 0) return;

    const interval = window.setInterval(async () => {
      try {
        const { data } = await axiosHelper.axiosInstance.get(`${API_URL}/processes/latest_runs`, {
          params: { ids: processIdsKey },
        });

        setLatestRunsByProcessId(
          Object.fromEntries(
            (data ?? []).map((item: { process_id: number; latest_run?: LatestRun | null }) => [
              item.process_id,
              item.latest_run ?? undefined,
            ])
          )
        );
      } catch {
        // Keep the last successful status snapshot if the refresh fails.
      }
    }, ACTIVE_RUN_POLL_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [processIdsKey, runningCount]);

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
          dataSource={(tableProps.dataSource ?? []).map((record) => ({
            ...record,
            latest_run: latestRunsByProcessId[(record as BaseRecord).id as number],
          }))}
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
          title=""
          width={40}
          render={(_, record: any) => (
            <span
              style={{ cursor: "pointer", fontSize: 16 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite("processes", record.id, record.code);
              }}
            >
              {isFavorite("processes", record.id) ? (
                <StarFilled style={{ color: "#cc8b1f" }} />
              ) : (
                <StarOutlined style={{ color: "var(--spade-muted)" }} />
              )}
            </span>
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
            if (!latestRun) {
              return <span className="run-status-meta">{latestRunsLoaded ? "Not run yet" : "Checking..."}</span>;
            }

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
