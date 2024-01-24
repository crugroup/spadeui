import {
  FileJpgOutlined,
  FileOutlined,
  FileSyncOutlined,
  NodeIndexOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp, Image, Space } from "antd";
import { Footer } from "antd/lib/layout/layout";
import { singular } from "pluralize";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { API_URL, USER_PERMISSIONS_KEY, authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import axiosHelper from "./helpers/axios-token-interceptor";
import {
  ExecutorCreate,
  ExecutorEdit,
  ExecutorList,
  ExecutorShow,
} from "./pages/executors";
import {
  FileFormatCreate,
  FileFormatEdit,
  FileFormatList,
  FileFormatShow,
} from "./pages/fileformats";
import {
  FileProcessorCreate,
  FileProcessorEdit,
  FileProcessorList,
  FileProcessorShow,
} from "./pages/fileprocessors";
import { FileCreate, FileEdit, FileList, FileShow } from "./pages/files";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import {
  ProcessCreate,
  ProcessEdit,
  ProcessList,
  ProcessShow,
} from "./pages/processes";
import { UpdatePassword } from "./pages/updatePassword";
import { dataProvider } from "./rest-data-provider";

import cruLogo from "./assets/cru.jpg";
import exlabsLogo from "./assets/exlabs.png";
import githubLogo from "./assets/github.png";

axiosHelper.setAxiosTokenInterceptor();

const ACTIONS_MAPPING = {
  create: "add",
  show: "view",
  list: "view",
  edit: "change",
  delete: "delete",
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                accessControlProvider={{
                  can: async ({ resource, action }) => {
                    if (!resource) {
                      return { can: true };
                    }

                    // Permissions are stored as a stringified JSON response from /api/permissions in local storage
                    const permissions: { name: string; codename: string }[] =
                      JSON.parse(
                        localStorage.getItem(USER_PERMISSIONS_KEY) ?? "[]"
                      );

                    // Superuser has access to all resources and actions
                    if (permissions.some((p) => p.codename === "*")) {
                      return { can: true };
                    }

                    // Action names used by Refine are different from the ones used by Django
                    const actionMapped =
                      ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING];

                    return {
                      can: permissions.some(
                        (p) =>
                          p.codename === `${actionMapped}_${singular(resource)}`
                      ),
                    };
                  },
                }}
                dataProvider={dataProvider(API_URL, axiosHelper.axiosInstance)}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "files",
                    list: "/files",
                    create: "/files/create",
                    edit: "/files/edit/:id",
                    show: "/files/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <FileOutlined />,
                    },
                  },
                  {
                    name: "fileformats",
                    list: "/fileformats",
                    create: "/fileformats/create",
                    edit: "/fileformats/edit/:id",
                    show: "/fileformats/show/:id",
                    meta: {
                      canDelete: true,
                      label: "File formats",
                      icon: <FileJpgOutlined />,
                    },
                  },
                  {
                    name: "fileprocessors",
                    list: "/fileprocessors",
                    create: "/fileprocessors/create",
                    edit: "/fileprocessors/edit/:id",
                    show: "/fileprocessors/show/:id",
                    meta: {
                      canDelete: true,
                      label: "File processors",
                      icon: <FileSyncOutlined />,
                    },
                  },
                  {
                    name: "executors",
                    list: "/executors",
                    create: "/executors/create",
                    edit: "/executors/edit/:id",
                    show: "/executors/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <PlayCircleOutlined />,
                    },
                  },
                  {
                    name: "processes",
                    list: "/processes",
                    create: "/processes/create",
                    edit: "/processes/edit/:id",
                    show: "/processes/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <NodeIndexOutlined />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "hkbITG-QnCUao-tHoTUD",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                          Title={() => (
                            <Link to="/">
                              <h1>Spadeshaft</h1>
                            </Link>
                          )}
                          Footer={() => (
                            <Footer style={{ position: "sticky", bottom: 0 }}>
                              <Space size="middle" style={{ float: "right" }}>
                                <a href="https://exlabs.com" target="_blank">
                                  <Image
                                    height={24}
                                    preview={false}
                                    src={exlabsLogo}
                                  />
                                </a>
                                <a href="https://crugroup.com" target="_blank">
                                  <Image
                                    height={24}
                                    preview={false}
                                    src={cruLogo}
                                  />
                                </a>
                                <a
                                  href="https://github.com/crugroup/spadeshaft"
                                  target="_blank"
                                >
                                  <Image
                                    height={24}
                                    preview={false}
                                    src={githubLogo}
                                  />
                                </a>
                              </Space>
                            </Footer>
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="files" />}
                    />
                    <Route path="/files">
                      <Route index element={<FileList />} />
                      <Route path="create" element={<FileCreate />} />
                      <Route path="edit/:id" element={<FileEdit />} />
                      <Route path="show/:id" element={<FileShow />} />
                    </Route>
                    <Route
                      index
                      element={<NavigateToResource resource="fileformats" />}
                    />
                    <Route path="/fileformats">
                      <Route index element={<FileFormatList />} />
                      <Route path="create" element={<FileFormatCreate />} />
                      <Route path="edit/:id" element={<FileFormatEdit />} />
                      <Route path="show/:id" element={<FileFormatShow />} />
                    </Route>
                    <Route path="/fileprocessors">
                      <Route index element={<FileProcessorList />} />
                      <Route path="show/:id" element={<FileProcessorShow />} />
                      <Route path="edit/:id" element={<FileProcessorEdit />} />
                      <Route path="create" element={<FileProcessorCreate />} />
                    </Route>
                    <Route path="/executors">
                      <Route index element={<ExecutorList />} />
                      <Route path="show/:id" element={<ExecutorShow />} />
                      <Route path="edit/:id" element={<ExecutorEdit />} />
                      <Route path="create" element={<ExecutorCreate />} />
                    </Route>
                    <Route path="/processes">
                      <Route index element={<ProcessList />} />
                      <Route path="show/:id" element={<ProcessShow />} />
                      <Route path="edit/:id" element={<ProcessEdit />} />
                      <Route path="create" element={<ProcessCreate />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/update-password"
                      element={<UpdatePassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
