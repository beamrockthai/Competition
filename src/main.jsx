// index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

// Context
import { UserAuthContextProvider } from "./Context/UserAuth";

// Layout
import App from "./App";

// Protected Route
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

// Components
import { Login } from "./components/UserAuth/Login";
import { Register } from "./components/UserAuth/Register";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Tournaments } from "./components/Tournaments/Tournaments";
import { Evaluation } from "./components/Evaluation/evaluation";

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
        // เมื่อเข้ามาที่ "/" โดยตรงให้โชว์ Dashboard หรือหน้า Welcome ก็ได้
        index: true,
        element: <h1>Welcome to Dashboard</h1>,
      },
      // หรือถ้าต้องการให้ "/" เป็นหน้า Dashboard จริง ๆ ก็ได้:
      // index: true,
      // element: <Dashboard />,

      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "tournaments",
        element: <Tournaments />,
      },
      {
        path: "evaluation",
        element: <Evaluation />,
      },
      {
        path: "setting",
        element: <h1>Setting</h1>,
      },
      {
        path: "manage directors",
        element: <h1>Manage Directors</h1>,
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
