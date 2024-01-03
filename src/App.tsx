import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { ErrorComponent, ThemedLayoutV2, ThemedSiderV2, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider, { axiosInstance } from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY, authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from "./pages/files";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import axios from "axios";

// TODO: Move logic related to the Axios to the separate file
axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const refreshAuthLogic = (failedRequest: any) =>
  axios
    .post(
      `${API_URL}/token/refresh/`,
      {
        refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((tokenRefreshResponse) => {
      if (tokenRefreshResponse.data.access) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokenRefreshResponse.data.access);
        failedRequest.response.config.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.access;
      }

      return Promise.resolve();
    })
    .catch((err) => {
      console.log("refreshAuthLogic err", err);

      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    });

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(API_URL)}
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
                      <Authenticated key="authenticated-inner" fallback={<CatchAllNavigate to="/login" />}>
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                          Title={() => (
                            <Link to="/">
                              <h1>SpadeShaft</h1>
                            </Link>
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route index element={<NavigateToResource resource="files" />} />
                    <Route path="/files">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
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
