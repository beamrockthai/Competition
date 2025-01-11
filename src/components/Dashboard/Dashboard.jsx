import React from "react";
import { Tournaments } from "../Tournaments/Tournaments";

export const Dashboard = () => {
  return (
    <div>
      <Tournaments highlight={true} />
    </div>
  );
};
