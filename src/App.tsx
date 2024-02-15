import "./styles/styles.scss";
import "@refinedev/antd/dist/reset.css";
import axiosHelper from "./helpers/axios-token-interceptor";
import resources from "./routes/resources";
import CustomRoutes from "./routes/routes";
import accessControlProvider from "./access-control-provider";
import { spadeTitleHandler } from "./helpers/title-handler";
import routerBindings, { DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { App as AntdApp } from "antd";
import { BrowserRouter } from "react-router-dom";
import { API_URL, authProvider } from "./auth-provider";
import { ThemeProvider } from "./contexts/theme-provider";
import { dataProvider } from "./rest-data-provider";

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
                  projectId: "hkbITG-QnCUao-tHoTUD",
                }}
              >
                <CustomRoutes />
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={spadeTitleHandler as any}/>
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
