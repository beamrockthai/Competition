import React from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardStats from "../../components/DashboardStats";
import UserTable from "../../components/UserTable";
import MockupCard from "../../components/MockupCard";
import FAQ from "../../components/faq";
import DashboardHeader2 from "../../components/DashboardHeader2";
import CardGet from "../../components/CardGet";
import DashboardHeader3 from "../../components/DashboardHeader3";
const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <DashboardStats />
      <DashboardHeader2 />
      <MockupCard />
      <DashboardHeader />
      <UserTable />
      <DashboardHeader3 />
      <CardGet />
      <FAQ />
    </div>
  );
};

export default Dashboard;
