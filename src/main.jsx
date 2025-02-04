import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

// Context
import { UserAuthContextProvider } from "./Context/UserAuth";

// Layout
import App from "./App";

// Protected Route
import { ProtectedRoute } from "./pages/ProtectedRoute/ProtectedRoute";

// Components
import { Login } from "./pages/UserAuth/Login";
import { Register } from "./pages/UserAuth/Register";
import { Evaluation } from "./pages/Evaluation/evaluation";
import { ManageDirectors } from "./pages/Admin/ManageDirectors";
import { UserManagement } from "./pages/Admin/UserManagement";
import AdminTournament from "./pages/Admin/AdminTournament"; // หน้าสร้างการแข่งขัน
import UserTouranments from "./pages/Dashboard/UserTouranments"; // หน้า User สมัครแข่งขัน
import UserRegisteredList from "./components/UserRegisteredList";
import DashboardMain from "./pages/Dashboard/DashboardMain";
import MyForm from "./pages/Assigned/MyForm";
// สร้าง Router ด้วยโครงสร้าง children
const router = createBrowserRouter([
  {
    // เส้นทางสำหรับ Login
    path: "/login",
    element: <Login />,
  },
  {
    // เส้นทางสำหรับ Register
    path: "/register",
    element: <Register />,
  },
  {
    // เส้นทางหลัก "/", ProtectedRoute ห่อ <App /> ทั้งหมด
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        // ✅ Default Route เมื่อเข้ามาที่ "/" โดยตรง ให้ไปหน้า "userdashboard"
        index: true, // กำหนด Route นี้เป็นหน้า Default
        element: <DashboardMain />, // เปลี่ยนไปหน้า Dashboard
      },

      {
        path: "userdashboardmain",
        element: <DashboardMain />,
      },

      {
        path: "userdashboard",
        element: <UserTouranments />,
      },

      {
        path: "userregisteredlist",
        element: <UserRegisteredList />,
      },

      {
        path: "evaluation",
        element: <Evaluation />,
      },
      {
        path: "setting",
        element: <h1>Setting</h1>,
      },
      // ✅ เพิ่ม Route สำหรับ Admin สร้างการแข่งขัน
      {
        path: "manage-directors",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageDirectors />
          </ProtectedRoute>
        ),
      },

      {
        path: "user-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin-tournaments",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTournament />
          </ProtectedRoute>
        ),
      },

      {
        path: "director-form",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <MyForm />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "manage directors",
      //   element: <h1>Manage Directors</h1>,
      // },

      // ✅ เพิ่ม Route สำหรับ User สมัครการแข่งขัน
      {
        path: "user/dashboard",
        element: <UserTouranments />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </StrictMode>
);
