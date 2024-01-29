import LogoutIcon from "../../public/icons/logout-icon";
import { ErrorComponent, ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router-v6";
import { Image, Space } from "antd";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { cloneElement, useContext } from "react";
import { ExecutorCreate, ExecutorEdit, ExecutorList, ExecutorShow } from "../pages/executors";
import { FileFormatCreate, FileFormatEdit, FileFormatList, FileFormatShow } from "../pages/fileformats";
import { FileProcessorCreate, FileProcessorEdit, FileProcessorList, FileProcessorShow } from "../pages/fileprocessors";
import { FileCreate, FileEdit, FileList, FileShow } from "../pages/files";
import { ForgotPassword } from "../pages/forgotPassword";
import { Login } from "../pages/login";
import { ProcessCreate, ProcessEdit, ProcessList, ProcessShow } from "../pages/processes";
import { UpdatePassword } from "../pages/updatePassword";
import { Header } from "../components/header";
import { ThemeProviderContext } from "../contexts/theme-provider";

const spadeLogos: { [key: string]: { single: string; full: string } } = {
  dark: {
    single: "/logos/spade-white-logo-single.svg",
    full: "/logos/spade-white-logo.svg",
  },
  light: {
    single: "/logos/spade-logo-single.svg",
    full: "/logos/spade-logo.svg",
  },
};

const CustomRoutes = () => {
  const { mode } = useContext(ThemeProviderContext);

  return (
    <Routes>
      <Route
        element={
          <Authenticated key="authenticated-inner" fallback={<CatchAllNavigate to="/login" />}>
            <ThemedLayoutV2
              Header={() => <Header sticky />}
              Sider={(props) => (
                <ThemedSiderV2
                  {...props}
                  fixed
                  render={(p) => (
                    <>
                      {p.items}
                      {cloneElement(p.logout as any, {
                        icon: <LogoutIcon />,
                      })}
                      <div className="icons-holder">
                        <Space direction="vertical" align="center" size="middle" style={{ width: "100%" }}>
                          <a href="https://crugroup.com" target="_blank" rel="noopener noreferrer">
                            <Image height={24} preview={false} src="/logos/cru.svg" />
                          </a>
                          <a href="https://exlabs.com" target="_blank" rel="noopener noreferrer">
                            <Image height={24} preview={false} src="/logos/exlabs.svg" />
                          </a>
                          <a href="https://github.com/crugroup/spadeshaft" target="_blank" rel="noopener noreferrer">
                            <Image height={24} preview={false} src="/logos/github.svg" />
                          </a>
                        </Space>
                      </div>
                    </>
                  )}
                />
              )}
              Title={({ collapsed }) => (
                <Link to="/">
                  <img
                    src={collapsed ? spadeLogos[mode]["single"] : spadeLogos[mode]["full"]}
                    style={!collapsed ? { marginLeft: -13 } : undefined}
                    alt="Spade logo"></img>
                </Link>
              )}>
              <Outlet />
            </ThemedLayoutV2>
          </Authenticated>
        }>
        <Route index element={<NavigateToResource resource="files" />} />
        <Route path="/files">
          <Route index element={<FileList />} />
          <Route path="create" element={<FileCreate />} />
          <Route path="edit/:id" element={<FileEdit />} />
          <Route path="show/:id" element={<FileShow />} />
        </Route>
        <Route index element={<NavigateToResource resource="fileformats" />} />
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
          <Authenticated key="authenticated-outer" fallback={<Outlet />}>
            <NavigateToResource />
          </Authenticated>
        }>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Route>
    </Routes>
  );
};

export default CustomRoutes;
