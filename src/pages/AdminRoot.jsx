import { Outlet, useNavigation } from "react-router-dom";
import { Button, Result, Spin } from "antd";
import { AdminLayout } from "../layout/AdminLayout";
import { authUser } from "../constrant";

export const AdminLoader = async () => {
  const authauth = [2];
  {
    authUser
      ? !authauth.includes(authUser.Role)
        ? window.location.assign("/nonaccess")
        : null
      : window.location.assign("/login");
  }

  return [];
};

export const AdminRoot = () => {
  const { state } = useNavigation();

  return (
    <AdminLayout>
      <Spin spinning={state === "loading" || state === "submitting"}>
        <Outlet />
      </Spin>
    </AdminLayout>
  );
};
