// components/ProtectedRoute/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../Context/UserAuth";

export const ProtectedRoute = ({ children }) => {
  const { user, role } = useUserAuth();

  if (!user) {
    // ถ้ายังไม่ได้ล็อกอิน ให้ไปหน้า "/login" ทันที
    return <Navigate to="/login" replace />;
  }

  return children;
};
