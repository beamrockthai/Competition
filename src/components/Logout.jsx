// import LoadingScreen from "react-loading-screen";

export const Logout = () => {
  localStorage.clear();

  window.location.assign("/");

  return (
    // <LoadingScreen
    //   loading={true}
    //   bgColor="#f1f1f1"
    //   spinnerColor="#9ee5f8"
    //   textColor="#676767"
    //   text="กำลังออกจากระบบ....."
    // />
    <></>
  );
};
