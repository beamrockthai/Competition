import { Outlet, useNavigation } from "react-router-dom";
import { Spin } from "antd";
import { AppLayout } from "../layout/AppLayout";

export async function RootLoader() {}

export const Root = () => {
  const { state } = useNavigation();

  return (
    <AppLayout>
      <Spin spinning={state === "loading" || state === "submitting"}>
        <Outlet />
      </Spin>
    </AppLayout>
  );
};
