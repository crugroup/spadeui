import { ErrorComponent, ThemedLayout, ThemedSider } from "@refinedev/antd";
import { Authenticated, CanAccess } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router";
import { Image, Result, Space } from "antd";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router";
import { useContext, lazy, Suspense } from "react";
import { Header } from "../../components/header";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import { ACCOUNT_CONFIRMATION_REQUIRED } from "../constants";

const Dashboard = lazy(() => import("../../pages/dashboard").then(m => ({ default: m.Dashboard })));
const FileList = lazy(() => import("../../pages/files/list").then(m => ({ default: m.FileList })));
const FileCreate = lazy(() => import("../../pages/files/create").then(m => ({ default: m.FileCreate })));
const FileEdit = lazy(() => import("../../pages/files/edit").then(m => ({ default: m.FileEdit })));
const FileShow = lazy(() => import("../../pages/files/show").then(m => ({ default: m.FileShow })));
const FileFormatList = lazy(() => import("../../pages/fileformats/list").then(m => ({ default: m.FileFormatList })));
const FileFormatCreate = lazy(() => import("../../pages/fileformats/create").then(m => ({ default: m.FileFormatCreate })));
const FileFormatEdit = lazy(() => import("../../pages/fileformats/edit").then(m => ({ default: m.FileFormatEdit })));
const FileFormatShow = lazy(() => import("../../pages/fileformats/show").then(m => ({ default: m.FileFormatShow })));
const FileProcessorList = lazy(() => import("../../pages/fileprocessors/list").then(m => ({ default: m.FileProcessorList })));
const FileProcessorCreate = lazy(() => import("../../pages/fileprocessors/create").then(m => ({ default: m.FileProcessorCreate })));
const FileProcessorEdit = lazy(() => import("../../pages/fileprocessors/edit").then(m => ({ default: m.FileProcessorEdit })));
const FileProcessorShow = lazy(() => import("../../pages/fileprocessors/show").then(m => ({ default: m.FileProcessorShow })));
const ExecutorList = lazy(() => import("../../pages/executors/list").then(m => ({ default: m.ExecutorList })));
const ExecutorCreate = lazy(() => import("../../pages/executors/create").then(m => ({ default: m.ExecutorCreate })));
const ExecutorEdit = lazy(() => import("../../pages/executors/edit").then(m => ({ default: m.ExecutorEdit })));
const ExecutorShow = lazy(() => import("../../pages/executors/show").then(m => ({ default: m.ExecutorShow })));
const ProcessList = lazy(() => import("../../pages/processes/list").then(m => ({ default: m.ProcessList })));
const ProcessCreate = lazy(() => import("../../pages/processes/create").then(m => ({ default: m.ProcessCreate })));
const ProcessEdit = lazy(() => import("../../pages/processes/edit").then(m => ({ default: m.ProcessEdit })));
const ProcessShow = lazy(() => import("../../pages/processes/show").then(m => ({ default: m.ProcessShow })));
const GroupList = lazy(() => import("../../pages/groups/list").then(m => ({ default: m.GroupList })));
const GroupCreate = lazy(() => import("../../pages/groups/create").then(m => ({ default: m.GroupCreate })));
const GroupEdit = lazy(() => import("../../pages/groups/edit").then(m => ({ default: m.GroupEdit })));
const GroupShow = lazy(() => import("../../pages/groups/show").then(m => ({ default: m.GroupShow })));
const UserList = lazy(() => import("../../pages/users/list").then(m => ({ default: m.UserList })));
const UserCreate = lazy(() => import("../../pages/users/create").then(m => ({ default: m.UserCreate })));
const UserEdit = lazy(() => import("../../pages/users/edit").then(m => ({ default: m.UserEdit })));
const UserShow = lazy(() => import("../../pages/users/show").then(m => ({ default: m.UserShow })));
const VariableList = lazy(() => import("../../pages/variables/list").then(m => ({ default: m.VariableList })));
const VariableCreate = lazy(() => import("../../pages/variables/create").then(m => ({ default: m.VariableCreate })));
const VariableEdit = lazy(() => import("../../pages/variables/edit").then(m => ({ default: m.VariableEdit })));
const VariableShow = lazy(() => import("../../pages/variables/show").then(m => ({ default: m.VariableShow })));
const VariableSetList = lazy(() => import("../../pages/variablesets/list").then(m => ({ default: m.VariableSetList })));
const VariableSetCreate = lazy(() => import("../../pages/variablesets/create").then(m => ({ default: m.VariableSetCreate })));
const VariableSetEdit = lazy(() => import("../../pages/variablesets/edit").then(m => ({ default: m.VariableSetEdit })));
const VariableSetShow = lazy(() => import("../../pages/variablesets/show").then(m => ({ default: m.VariableSetShow })));
const UpdatePasswordLoggedIn = lazy(() => import("../../pages/updatePasswordLoggedIn").then(m => ({ default: m.UpdatePasswordLoggedIn })));
const Login = lazy(() => import("../../pages/auth/login").then(m => ({ default: m.Login })));
const ForgotPassword = lazy(() => import("../../pages/auth/forgotPassword").then(m => ({ default: m.ForgotPassword })));
const UpdatePassword = lazy(() => import("../../pages/auth/updatePassword").then(m => ({ default: m.UpdatePassword })));
const Register = lazy(() => import("../../pages/auth/register").then(m => ({ default: m.Register })));
const AccountCreated = lazy(() => import("../../pages/auth/accountCreated").then(m => ({ default: m.AccountCreated })));
const ConfirmEmail = lazy(() => import("../../pages/auth/confirmEmail").then(m => ({ default: m.ConfirmEmail })));

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
            <ThemedLayout
              Header={() => <Header sticky />}
              Sider={(props) => (
                <ThemedSider
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
                    alt="Spade logo"
                  ></img>
                </Link>
              )}
            >
              <Outlet />
            </ThemedLayout>
          </Authenticated>
        }
      >
        <Route
          index
          element={
            <CanAccess
              resource="dashboard"
              action="list"
              fallback={<Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />}
            >
              <Suspense fallback={null}><Dashboard /></Suspense>
            </CanAccess>
          }
        />
        <Route path="/files">
          <Route
            index
            element={
              <CanAccess resource="files" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="files" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="files" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="files" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/fileformats">
          <Route
            index
            element={
              <CanAccess resource="fileformats" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileFormatList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="fileformats" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileFormatCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="fileformats" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileFormatEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="fileformats" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileFormatShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/fileprocessors">
          <Route
            index
            element={
              <CanAccess resource="fileprocessors" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileProcessorList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="fileprocessors" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileProcessorCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="fileprocessors" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileProcessorEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="fileprocessors" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><FileProcessorShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/executors">
          <Route
            index
            element={
              <CanAccess resource="executors" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ExecutorList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="executors" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ExecutorCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="executors" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ExecutorEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="executors" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ExecutorShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/processes">
          <Route
            index
            element={
              <CanAccess resource="processes" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ProcessList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="processes" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ProcessCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="processes" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ProcessEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="processes" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><ProcessShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/groups">
          <Route
            index
            element={
              <CanAccess resource="groups" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><GroupList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="groups" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><GroupCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="groups" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><GroupEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="groups" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><GroupShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/users">
          <Route
            index
            element={
              <CanAccess resource="users" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><UserList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="users" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><UserCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="users" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><UserEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="users" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><UserShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/variables">
          <Route
            index
            element={
              <CanAccess resource="variables" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="variables" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="variables" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="variables" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/variable-sets">
          <Route
            index
            element={
              <CanAccess resource="variable-sets" action="list" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableSetList /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="create"
            element={
              <CanAccess resource="variable-sets" action="create" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableSetCreate /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="edit/:id"
            element={
              <CanAccess resource="variable-sets" action="edit" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableSetEdit /></Suspense>
              </CanAccess>
            }
          />
          <Route
            path="show/:id"
            element={
              <CanAccess resource="variable-sets" action="show" onUnauthorized={() => navigate("/")}>
                <Suspense fallback={null}><VariableSetShow /></Suspense>
              </CanAccess>
            }
          />
        </Route>
        <Route path="/update-password" element={<Suspense fallback={null}><UpdatePasswordLoggedIn /></Suspense>} />
        <Route path="*" element={<ErrorComponent />} />
      </Route>
      <Route
        element={
          <Authenticated key="authenticated-outer" fallback={<Outlet />}>
            <NavigateToResource />
          </Authenticated>
        }
      >
        <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
        {ACCOUNT_CONFIRMATION_REQUIRED && (
          <>
            <Route path="/register" element={<Suspense fallback={null}><Register /></Suspense>} />
            <Route
              path="/account-created"
              element={
                <ThemedLayout Sider={() => null}>
                  <Suspense fallback={null}><AccountCreated /></Suspense>
                </ThemedLayout>
              }
            />
            <Route
              path="/confirm-email/:token"
              element={
                <ThemedLayout Sider={() => null}>
                  <Suspense fallback={null}><ConfirmEmail /></Suspense>
                </ThemedLayout>
              }
            />
          </>
        )}
        <Route path="/forgot-password" element={<Suspense fallback={null}><ForgotPassword /></Suspense>} />
        <Route path="/update-password/:uid/:token" element={<Suspense fallback={null}><UpdatePassword /></Suspense>} />
      </Route>
    </Routes>
  );
};

export default CustomRoutes;
