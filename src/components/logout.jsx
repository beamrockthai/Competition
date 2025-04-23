import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const BackToLoginButton = () => {
  const navigate = useNavigate();

  return (
    <Button type="link" onClick={() => navigate("/login")}>
      ย้อนกลับไปล็อกอิน
    </Button>
  );
};

export default BackToLoginButton;
