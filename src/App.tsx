import "./styles/styles.scss";
import "@refinedev/antd/dist/reset.css";
import axiosHelper from "./helpers/axios-token-interceptor";
import resources from "./config/routes/resources";
import CustomRoutes from "./config/routes/routes";
import accessControlProvider from "./config/access-control-provider";
import { spadeTitleHandler } from "./helpers/title-handler";
import routerBindings, { DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { App as AntdApp } from "antd";
import { BrowserRouter } from "react-router-dom";
import { authProvider } from "./config/auth-provider";
import { ThemeProvider } from "./contexts/theme-provider";
import { dataProvider } from "./config/rest-data-provider";
import { API_URL } from "./config/constants";

axiosHelper.setAxiosTokenInterceptor();

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                accessControlProvider={accessControlProvider}
                dataProvider={dataProvider(API_URL, axiosHelper.axiosInstance)}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                }}
              >
                <CustomRoutes />
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={spadeTitleHandler as any} />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
