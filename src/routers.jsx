import { createBrowserRouter } from "react-router-dom";
import { Root, RootLoader } from "./pages/Root";

import { LoginPage } from "./pages/Login";
// import { Logout } from "./components/Logout";

import { Home } from "./pages/imac/Home";
import { Logout } from "./components/Logout";

import { AdminLoader, AdminRoot } from "./pages/AdminRoot";
import { AboutPage } from "./pages/imac/About";
import { RoadMapPage } from "./pages/imac/RoadMap";
import { OurTeamPage } from "./pages/imac/OurTeam";
import { ContactPage } from "./pages/imac/Contact";
import { DirectorHomePage } from "./pages/Director/DirectorHome";
import { DirectorLoader, DirectorRoot } from "./pages/DirectorRoot";
import { LoginRegisPage } from "./pages/imac/LoginRegis";
import { TeamCreatePage } from "./pages/imac/Team/TeamCreate";
import { TeamPage } from "./pages/imac/Team/Team";
import { TeamEditPage } from "./pages/imac/Team/TeamEdit";
import { UserLoginPage } from "./pages/imac/UserLogin";
import { NonAccessPage } from "./components/NonAccess";
import { ManageDirectorsPage } from "./pages/Admin/ManageDirectors";
import { UserManagementPage } from "./pages/Admin/UserManagement";
import { AdminTournamentPage } from "./pages/Admin/AdminTournament";
import { DashboardMainPage } from "./pages/Admin/Dashboard/DashboardMain";
import { EvaluationPage } from "./pages/Evaluation/evaluation";
import { CurrentRoundPage } from "./pages/Admin/RoundConfig/CurrentRound";
import { TeamManagementPage } from "./pages/Admin/TeamMangement/TeamManagement";
import { TeamStepsPage } from "./pages/imac/Team/TeamSteps";
import { TeamUploadPage } from "./pages/imac/Team/TeamUpload";
import { MePage } from "./pages/Me";
import { UserRoot, UserRootLoader } from "./pages/UserRoot";
import { TeamConsultPage } from "./components/TeamConsult";
import { TeamMemberPage } from "./components/TeamMember";

// import { AdminHomePage } from "./pages/Admin/AdminHome";

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",

    element: <Root />,
    children: [
      {
        path: "/",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <Home />,
      },
      {
        path: "/about",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <AboutPage />,
      },
      {
        path: "/roadmap",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <RoadMapPage />,
      },
      {
        path: "/ourteam",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <OurTeamPage />,
      },
      {
        path: "/contact",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <ContactPage />,
      },
      {
        path: "/register",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <LoginRegisPage />,
      },
      {
        path: "/userlogin",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <UserLoginPage />,
      },
    ],
  },
  {
    path: "/user",
    id: "userroot",
    loader: UserRootLoader,
    element: <UserRoot />,
    children: [
      {
        path: "team",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamPage />,
      },
      {
        path: "teamcreate",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamCreatePage />,
      },
      {
        path: "teamedit",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamEditPage />,
      },
      {
        path: "teamsteps",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamStepsPage />,
      },
      {
        path: "teamupload",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamUploadPage />,
      },
      {
        path: "teamconsult",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamConsultPage />,
      },
      {
        path: "teammember",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamMemberPage />,
      },
      {
        path: "me",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <MePage />,
      },
    ],
  },
  {
    path: "/admin",
    id: "admin",
    loader: AdminLoader,
    element: <AdminRoot />,
    children: [
      {
        path: "",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <DashboardMainPage />,
      },
      {
        path: "managedirector",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <ManageDirectorsPage />,
      },
      {
        path: "evaluation",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <EvaluationPage />,
      },
      {
        path: "roundconfig",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <CurrentRoundPage />,
      },
      {
        path: "teammanagement",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <TeamManagementPage />,
      },

      {
        path: "tournament",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <AdminTournamentPage />,
      },
    ],
  },
  {
    path: "/director",
    id: "director",
    loader: DirectorLoader,
    element: <DirectorRoot />,
    children: [
      {
        path: "",
        // loader: deskIndexLoader,
        // action: deskIndexAction, // FIXME: action is defined to call api
        element: <DirectorHomePage />,
      },
    ],
  },
  {
    path: "/nonaccess",
    // action: LoginAction,
    element: <NonAccessPage />,
  },
  {
    path: "/login",
    // action: LoginAction,
    element: <LoginPage />,
  },
  {
    path: "/logout",
    // action: LoginAction,
    element: <Logout />,
  },
]);
