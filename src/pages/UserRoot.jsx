import { Outlet, useNavigation } from "react-router-dom";
import { Spin } from "antd";
import { AppLayout } from "../layout/AppLayout";
import { authUser } from "../constrant";

export async function UserRootLoader() {
  if (!authUser) {
    localStorage.clear();
    window.location.assign("/login");
  }
}

export const UserRoot = () => {
  const { state } = useNavigation();

  return (
    <AppLayout>
      <Spin spinning={state === "loading" || state === "submitting"}>
        <Outlet />
      </Spin>
    </AppLayout>
  );
};
