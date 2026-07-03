import { Card, Col, Row, Statistic, Typography, Tag, Space, Button, Modal, List, Input } from "antd";
import {
  FileOutlined,
  NodeIndexOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  StarFilled,
  UploadOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosHelper from "../../helpers/axios-token-interceptor";
import { API_URL } from "../../config/constants";
import { useFavorites } from "../../hooks/useFavorites";
import { FileUploadButton } from "../../components/file-upload-button";

const { Title, Text } = Typography;

/* ---------- helpers ---------- */

const getRunState = (lr?: { status?: string; result?: string }) => {
  const s = lr?.status?.toLowerCase();
  const r = lr?.result?.toLowerCase();
  if (!s && !r) return "idle";
  if (s === "running" || s === "new") return "running";
  if (s === "error" || r === "failed" || r === "error" || r === "warning") return "failed";
  if (r === "success" || s === "finished") return "success";
  return "idle";
};

const relativeTime = (iso?: string) => {
  if (!iso) return "";
  const ts = Date.parse(iso);
  if (!Number.isFinite(ts)) return "";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ---------- component ---------- */

export const Dashboard = () => {
  const navigate = useNavigate();
  const { getAllFavorites } = useFavorites();
  const [hoveredFav, setHoveredFav] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  const [quickUploadSearch, setQuickUploadSearch] = useState("");
  const [showAllFavorites, setShowAllFavorites] = useState(false);

  // --- fetch files & processes via React Query ---
  const { data: filesRaw, isLoading: filesLoading } = useQuery({
    queryKey: ["dashboard", "files"],
    queryFn: () => axiosHelper.axiosInstance.get(`${API_URL}/files`).then(r => r.data),
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  });
  const { data: processesRaw, isLoading: processesLoading } = useQuery({
    queryKey: ["dashboard", "processes"],
    queryFn: () => axiosHelper.axiosInstance.get(`${API_URL}/processes`).then(r => r.data),
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  });

  const fileList = useMemo(() => {
    const data = filesRaw;
    return Array.isArray(data) ? data : data?.results ?? null;
  }, [filesRaw]);
  const processList = useMemo(() => {
    const data = processesRaw;
    return Array.isArray(data) ? data : data?.results ?? [];
  }, [processesRaw]);
  const isStatsLoading = filesLoading || processesLoading;

  const allFavorites = useMemo(() => getAllFavorites(), [getAllFavorites]);
  const favoriteFileIds = useMemo(
    () => new Set(allFavorites.filter((f) => f.resource === "files").map((f) => f.id)),
    [allFavorites]
  );

  const quickUploadFiles = useMemo(() => {
    if (!fileList) return [];
    const favs = fileList.filter((f: any) => favoriteFileIds.has(f.id));
    const others = fileList.filter((f: any) => !favoriteFileIds.has(f.id));
    return [...favs, ...others];
  }, [fileList, favoriteFileIds]);

  // --- latest runs for favorited processes ---
  const processFavoriteIds = allFavorites
    .filter((f) => f.resource === "processes")
    .map((f) => f.id);

  const { data: favRunsRaw } = useQuery({
    queryKey: ["dashboard", "latest_runs", "favorites", processFavoriteIds.join(",")],
    queryFn: () => axiosHelper.axiosInstance
      .get(`${API_URL}/processes/latest_runs`, { params: { ids: processFavoriteIds.join(",") } })
      .then(r => r.data),
    enabled: processFavoriteIds.length > 0,
    staleTime: 30_000,
  });

  const latestRunsByProcessId = useMemo(() => {
    const map: Record<number, any> = {};
    (favRunsRaw ?? []).forEach((item: any) => {
      if (item.latest_run) map[item.process_id] = item.latest_run;
    });
    return map;
  }, [favRunsRaw]);
  const latestRunsLoaded = processFavoriteIds.length === 0 || !!favRunsRaw;
  const latestRunsTimedOut = false; // React Query handles timeouts internally

  // --- recent activity: latest runs across ALL processes ---
  const allProcessIdsKey = processList.map((p: any) => p.id).filter(Boolean).join(",");

  const { data: recentRunsRaw, isLoading: recentRunsLoading } = useQuery({
    queryKey: ["dashboard", "latest_runs", "all", allProcessIdsKey],
    queryFn: () => axiosHelper.axiosInstance
      .get(`${API_URL}/processes/latest_runs`, { params: { ids: allProcessIdsKey } })
      .then(r => r.data),
    enabled: !!allProcessIdsKey,
    staleTime: 30_000,
  });

  const recentRuns = useMemo(() => {
    const runs: any[] = [];
    (recentRunsRaw ?? []).forEach((item: any) => {
      if (item.latest_run && item.latest_run.created_at) {
        runs.push({
          process_id: item.process_id,
          process_code: processList.find((p: any) => p.id === item.process_id)?.code || `#${item.process_id}`,
          ...item.latest_run,
        });
      }
    });
    runs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return runs.slice(0, 5);
  }, [recentRunsRaw, processList]);

  // --- stats ---
  const runningCount = processList.filter((p: any) => {
    const lr = latestRunsByProcessId[p.id] || p.latest_run;
    return lr?.status === "running" || lr?.status === "new";
  }).length;
  const failedCount = processList.filter((p: any) => {
    const lr = latestRunsByProcessId[p.id] || p.latest_run;
    return lr?.result === "failed" || lr?.status === "error";
  }).length;

  /* ---------- render ---------- */

  const statCards = [
    { title: "Files", value: fileList?.length ?? 0, icon: <FileOutlined />, color: "#30A4FD", bg: "rgba(48,164,253,0.10)" },
    { title: "Processes", value: processList.length, icon: <NodeIndexOutlined />, color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
    { title: "Running", value: runningCount, icon: <SyncOutlined spin={runningCount > 0} />, color: runningCount > 0 ? "#cc8b1f" : undefined, bg: runningCount > 0 ? "rgba(204,139,31,0.10)" : undefined },
    { title: "Failed", value: failedCount, icon: <CloseCircleOutlined />, color: failedCount > 0 ? "#d8484b" : undefined, bg: failedCount > 0 ? "rgba(216,72,75,0.10)" : undefined },
  ];

  return (
    <div style={{ padding: "0 0 24px" }}>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard</Title>

      {/* ---- Stats ---- */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((s) => (
          <Col xs={12} sm={6} key={s.title}>
            <Card
              size="small"
              loading={isStatsLoading}
              style={{ borderLeft: s.bg ? `3px solid ${s.color}` : undefined, borderRadius: 10 }}
            >
              <Statistic
                title={s.title}
                value={s.value}
                prefix={s.icon}
                valueStyle={{ color: s.color, fontSize: 28, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ---- Favorites + Quick Actions ---- */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={14}>
          <Card
            title={<Space><StarFilled style={{ color: "#cc8b1f" }} />Favorites</Space>}
            size="small"
            extra={allFavorites.length > 0 ? <Text type="secondary">{allFavorites.length} items</Text> : null}
          >
            {allFavorites.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--spade-muted)" }}>
                <StarFilled style={{ fontSize: 32, color: "var(--spade-border)", marginBottom: 12 }} />
                <br />
                <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                  Star items in Files or Processes to see them here.
                </Text>
                <Space>
                  <Link to="/files"><Button size="small" icon={<FileOutlined />}>Browse Files</Button></Link>
                  <Link to="/processes"><Button size="small" icon={<NodeIndexOutlined />}>Browse Processes</Button></Link>
                </Space>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {allFavorites.slice(0, showAllFavorites ? undefined : 10).map((fav) => {
                    const key = `${fav.resource}:${fav.id}`;
                    const isProcess = fav.resource === "processes";
                    const lr = isProcess ? latestRunsByProcessId[fav.id] : null;
                    const state = getRunState(lr);

                    return (
                      <div
                        key={key}
                        style={{
                          cursor: "pointer",
                          padding: "8px 12px",
                          borderRadius: 8,
                          background: hoveredFav === key ? "rgba(48, 164, 253, 0.07)" : "transparent",
                          transition: "background 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={() => setHoveredFav(key)}
                        onMouseLeave={() => setHoveredFav(null)}
                        onClick={() => navigate(`/${fav.resource}/show/${fav.id}`)}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                          {isProcess
                            ? <NodeIndexOutlined style={{ color: "var(--spade-muted)", fontSize: 16 }} />
                            : <FileOutlined style={{ color: "var(--spade-muted)", fontSize: 16 }} />
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text ellipsis style={{ fontWeight: 500, display: "block" }}>{fav.label}</Text>
                          </div>
                          {isProcess && (
                            lr ? (
                              <Tag className={`run-status-chip run-status-chip--${state}`}>{state}</Tag>
                            ) : (
                              <Text type="secondary" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                                {latestRunsLoaded ? (latestRunsTimedOut ? "Unknown" : "Not run yet") : "Checking..."}
                              </Text>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {allFavorites.length > 10 && (
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <Button type="link" size="small" onClick={() => setShowAllFavorites((v) => !v)}>
                      {showAllFavorites ? "Show less" : `Show all ${allFavorites.length} favorites`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Quick Actions" size="small">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Button block size="large" icon={<UploadOutlined />} type="primary" onClick={() => setUploadModalOpen(true)}>
                Quick Upload
              </Button>
              <Link to="/files">
                <Button block size="large" icon={<FileOutlined />}>Browse Files</Button>
              </Link>
              <Link to="/processes">
                <Button block size="large" icon={<NodeIndexOutlined />}>Browse Processes</Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* ---- Recent Activity ---- */}
      <Card
        title={<Space><ClockCircleOutlined style={{ color: "var(--spade-muted)" }} />Recent Activity</Space>}
        size="small"
      >
        {recentRunsLoading ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Text type="secondary">Loading activity...</Text>
          </div>
        ) : recentRuns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--spade-muted)" }}>
            <Text type="secondary">No process runs yet. Run a process to see activity here.</Text>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentRuns.map((run: any, i: number) => {
              const state = getRunState(run);
              const stateIcon =
                state === "success" ? <CheckCircleOutlined style={{ color: "#2b9d70" }} />
                : state === "failed" ? <ExclamationCircleOutlined style={{ color: "#d8484b" }} />
                : state === "running" ? <SyncOutlined spin style={{ color: "#cc8b1f" }} />
                : <ClockCircleOutlined style={{ color: "var(--spade-muted)" }} />;

              return (
                <div
                  key={`${run.process_id}-${i}`}
                  style={{
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "transparent",
                    transition: "background 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(48, 164, 253, 0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => navigate(`/processes/show/${run.process_id}`)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    {stateIcon}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text ellipsis style={{ fontWeight: 500, display: "block" }}>{run.process_code}</Text>
                    </div>
                    <Tag className={`run-status-chip run-status-chip--${state}`}>{state}</Tag>
                    <Text type="secondary" style={{ fontSize: 11, whiteSpace: "nowrap", minWidth: 50, textAlign: "right" }}>
                      {relativeTime(run.created_at)}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ---- Quick Upload Modal ---- */}
      <Modal
        title="Quick Upload"
        open={uploadModalOpen}
        onCancel={() => { setUploadModalOpen(false); setSelectedFileId(null); }}
        footer={null}
        width={600}
        className="quick-upload-modal"
      >
        {selectedFileId ? (
          <div style={{ background: "var(--spade-surface-soft)", borderRadius: 10, padding: 16 }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
              Uploading to: <Text strong>{fileList?.find((f: any) => f.id === selectedFileId)?.code}</Text>
            </Text>
            <FileUploadButton
              recordItemId={selectedFileId}
              buttonProps={{ type: "primary", block: true, size: "large" }}
              hideText
            />
            <Button type="link" style={{ marginTop: 8 }} onClick={() => setSelectedFileId(null)}>
              ← Choose a different file
            </Button>
          </div>
        ) : (
          (() => {
            const q = quickUploadSearch.trim().toLowerCase();
            const filtered = quickUploadFiles.filter((f: any) =>
              !q ||
              f.code?.toLowerCase().includes(q) ||
              f.description?.toLowerCase().includes(q)
            );
            const favFiles = filtered.filter((f: any) => favoriteFileIds.has(f.id));
            const otherFiles = filtered.filter((f: any) => !favoriteFileIds.has(f.id));
            const searching = quickUploadSearch.length > 0;

            return (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search files..."
                    allowClear
                    value={quickUploadSearch}
                    onChange={(e) => setQuickUploadSearch(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Text type="secondary" style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                    {fileList === null ? "Loading…" : searching ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : `${quickUploadFiles.length} files`}
                  </Text>
                </div>

                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--spade-muted)" }}>
                    <SearchOutlined style={{ fontSize: 28, marginBottom: 8, display: "block" }} />
                    <Text type="secondary">
                      {fileList === null ? "Loading files..." : searching ? `No files match "${q}"` : "No files available"}
                    </Text>
                  </div>
                ) : (
                  <div style={{ maxHeight: 360, overflow: "auto", position: "relative" }}>
                    {/* Favorites section */}
                    {favFiles.length > 0 && (
                      <>
                        <div style={{
                          padding: "6px 12px 4px",
                          marginBottom: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          borderBottom: "1px solid var(--spade-border)",
                        }}>
                          <StarFilled style={{ color: "#cc8b1f", fontSize: 12 }} />
                          <Text strong style={{ fontSize: 12, color: "var(--spade-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Favorites
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>({favFiles.length})</Text>
                        </div>
                        {favFiles.map((file: any) => (
                          <div
                            key={`fav-${file.id}`}
                            role="button"
                            tabIndex={0}
                            aria-label={`Upload to ${file.code}`}
                            style={{
                              cursor: "pointer",
                              padding: "8px 12px",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(48,164,253,0.06)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            onFocus={(e) => (e.currentTarget.style.background = "rgba(48,164,253,0.06)")}
                            onBlur={(e) => (e.currentTarget.style.background = "transparent")}
                            onClick={() => { setSelectedFileId(file.id); setQuickUploadSearch(""); }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedFileId(file.id);
                                setQuickUploadSearch("");
                              }
                            }}
                          >
                            <StarFilled style={{ color: "#cc8b1f", fontSize: 14 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text ellipsis style={{ fontWeight: 500, display: "block" }}>{file.code}</Text>
                              {file.description && <Text type="secondary" style={{ fontSize: 12 }} ellipsis>{file.description}</Text>}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* All files section */}
                    {otherFiles.length > 0 && (
                      <>
                        {favFiles.length > 0 && (
                          <div style={{
                            padding: "6px 12px 4px",
                            margin: "4px 0 2px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            borderBottom: "1px solid var(--spade-border)",
                          }}>
                            <FileOutlined style={{ color: "var(--spade-muted)", fontSize: 12 }} />
                            <Text strong style={{ fontSize: 12, color: "var(--spade-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              All files
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>({otherFiles.length})</Text>
                          </div>
                        )}
                        {otherFiles.map((file: any) => (
                          <div
                            key={`file-${file.id}`}
                            role="button"
                            tabIndex={0}
                            aria-label={`Upload to ${file.code}`}
                            style={{
                              cursor: "pointer",
                              padding: "8px 12px",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(48,164,253,0.06)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            onFocus={(e) => (e.currentTarget.style.background = "rgba(48,164,253,0.06)")}
                            onBlur={(e) => (e.currentTarget.style.background = "transparent")}
                            onClick={() => { setSelectedFileId(file.id); setQuickUploadSearch(""); }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedFileId(file.id);
                                setQuickUploadSearch("");
                              }
                            }}
                          >
                            <FileOutlined style={{ color: "var(--spade-muted)", fontSize: 14 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text ellipsis style={{ fontWeight: 500, display: "block" }}>{file.code}</Text>
                              {file.description && <Text type="secondary" style={{ fontSize: 12 }} ellipsis>{file.description}</Text>}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Scroll hint */}
                    {filtered.length > 8 && (
                      <div style={{
                        textAlign: "center",
                        padding: "6px 0 2px",
                        background: "linear-gradient(to top, var(--spade-surface), transparent)",
                        position: "sticky",
                        bottom: 0,
                        pointerEvents: "none",
                      }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Scroll for more · {filtered.length} files total
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })()
        )}
      </Modal>
    </div>
  );
};
