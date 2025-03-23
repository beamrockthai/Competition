import { Outlet, useNavigation } from "react-router-dom";
import { Spin } from "antd";

import { DirectorLayout } from "../layout/DirectorLayout.jsx";
import { authUser } from "../constrant.jsx";

export async function DirectorLoader() {
  const authauth = [2, 3];
  {
    authUser
      ? !authauth.includes(authUser.Role)
        ? window.location.assign("/nonaccess")
        : null
      : window.location.assign("/login");
  }

  return [];
}

export const DirectorRoot = () => {
  const { state } = useNavigation();

  return (
    <DirectorLayout>
      <Spin spinning={state === "loading" || state === "submitting"}>
        <Outlet />
      </Spin>
    </DirectorLayout>
  );
};
