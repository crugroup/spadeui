import { ErrorComponent, ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";
import { Authenticated, CanAccess } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router-v6";
import { Image, Space } from "antd";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ExecutorCreate, ExecutorEdit, ExecutorList, ExecutorShow } from "../../pages/executors";
import { FileFormatCreate, FileFormatEdit, FileFormatList, FileFormatShow } from "../../pages/fileformats";
import {
  FileProcessorCreate,
  FileProcessorEdit,
  FileProcessorList,
  FileProcessorShow,
} from "../../pages/fileprocessors";
import { FileCreate, FileEdit, FileList, FileShow } from "../../pages/files";
import { ForgotPassword } from "../../pages/auth/forgotPassword";
import { Login } from "../../pages/auth/login";
import { ProcessCreate, ProcessEdit, ProcessList, ProcessShow } from "../../pages/processes";
import { UpdatePassword } from "../../pages/auth/updatePassword";
import { Header } from "../../components/header";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import { Register } from "../../pages/auth/register";
import { AccountCreated } from "../../pages/auth/accountCreated";
import { ConfirmEmail } from "../../pages/auth/confirmEmail";
import { UpdatePasswordLoggedIn } from "../../pages/updatePasswordLoggedIn";
import { ACCOUNT_CONFIRMATION_REQUIRED } from "../constants";

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
  const navigate = useNavigate();
  const { mode } = useContext(ThemeProviderContext);

  return (
    <Routes>
      <Route
        element={
          <Authenticated key="authenticated-inner" appendCurrentPathToQuery={false}>
            <ThemedLayoutV2
              Header={() => <Header sticky />}
              Sider={(props) => (
                <ThemedSiderV2
                  {...props}
                  fixed
                  render={(p) => (
                    <>
                      {p.items}
                      <div className="icons-holder">
                        <Space direction={p.collapsed ? "vertical" : "horizontal"} align="center" size="middle">
                          <a href="https://crugroup.com" target="_blank" rel="noopener noreferrer">
                            <Image height={24} preview={false} src="/logos/cru.svg" />
                          </a>
                          <a href="https://exlabs.com" target="_blank" rel="noopener noreferrer">
                            <Image height={24} preview={false} src="/logos/exlabs.svg" />
                          </a>
                          <a href="https://github.com/crugroup/spadeui" target="_blank" rel="noopener noreferrer">
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
        <Route
          index
          element={
            <CanAccess
              resource="files"
              action="list"
              onUnauthorized={() => {
                navigate("/");
              }}>
              <NavigateToResource resource="files" />
            </CanAccess>
          }
        />
        <Route path="/files">
          <Route
            index
            element={
              <CanAccess resource="files" action="list" onUnauthorized={() => navigate("/")}>
                <FileList />
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="files" action="create" onUnauthorized={() => navigate("/")}>
                <FileCreate />
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="files" action="edit" onUnauthorized={() => navigate("/")}>
                <FileEdit />
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="files" action="show" onUnauthorized={() => navigate("/")}>
                <FileShow />
              </CanAccess>
            }
          />
        </Route>
        <Route path="/fileformats">
          <Route
            index
            element={
              <CanAccess resource="fileformats" action="list" onUnauthorized={() => navigate("/")}>
                <FileFormatList />
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="fileformats" action="create" onUnauthorized={() => navigate("/")}>
                <FileFormatCreate />
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="fileformats" action="edit" onUnauthorized={() => navigate("/")}>
                <FileFormatEdit />
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="fileformats" action="show" onUnauthorized={() => navigate("/")}>
                <FileFormatShow />
              </CanAccess>
            }
          />
        </Route>
        <Route path="/fileprocessors">
          <Route
            index
            element={
              <CanAccess resource="fileprocessors" action="list" onUnauthorized={() => navigate("/")}>
                <FileProcessorList />
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="fileprocessors" action="create" onUnauthorized={() => navigate("/")}>
                <FileProcessorCreate />
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="fileprocessors" action="edit" onUnauthorized={() => navigate("/")}>
                <FileProcessorEdit />
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="fileprocessors" action="show" onUnauthorized={() => navigate("/")}>
                <FileProcessorShow />
              </CanAccess>
            }
          />
        </Route>
        <Route path="/executors">
          <Route
            index
            element={
              <CanAccess resource="executors" action="list" onUnauthorized={() => navigate("/")}>
                <ExecutorList />
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="executors" action="create" onUnauthorized={() => navigate("/")}>
                <ExecutorCreate />
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="executors" action="edit" onUnauthorized={() => navigate("/")}>
                <ExecutorEdit />
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="executors" action="show" onUnauthorized={() => navigate("/")}>
                <ExecutorShow />
              </CanAccess>
            }
          />
        </Route>
        <Route path="/processes">
          <Route
            index
            element={
              <CanAccess resource="processes" action="list" onUnauthorized={() => navigate("/")}>
                <ProcessList />
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="processes" action="create" onUnauthorized={() => navigate("/")}>
                <ProcessCreate />
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="processes" action="edit" onUnauthorized={() => navigate("/")}>
                <ProcessEdit />
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="processes" action="show" onUnauthorized={() => navigate("/")}>
                <ProcessShow />
              </CanAccess>
            }
          />
        </Route>
        <Route path="/update-password" element={<UpdatePasswordLoggedIn />} />
        <Route path="*" element={<ErrorComponent />} />
      </Route>
      <Route
        element={
          <Authenticated key="authenticated-outer" fallback={<Outlet />}>
            <NavigateToResource />
          </Authenticated>
        }>
        <Route path="/login" element={<Login />} />
        {ACCOUNT_CONFIRMATION_REQUIRED && (
          <>
            <Route path="/register" element={<Register />} />
            <Route
              path="/account-created"
              element={
                <ThemedLayoutV2 Sider={() => null}>
                  <AccountCreated />
                </ThemedLayoutV2>
              }
            />
            <Route
              path="/confirm-email/:token"
              element={
                <ThemedLayoutV2 Sider={() => null}>
                  <ConfirmEmail />
                </ThemedLayoutV2>
              }
            />
          </>
        )}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password/:uid/:token" element={<UpdatePassword />} />
      </Route>
    </Routes>
  );
};

export default CustomRoutes;
