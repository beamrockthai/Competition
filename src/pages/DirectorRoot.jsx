import { Outlet, useNavigation } from "react-router-dom";
import { Spin } from "antd";

import { DirectorLayout } from "../layout/DirectorLayout.jsx";

export async function DirectorLoader() {
  return null;
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
