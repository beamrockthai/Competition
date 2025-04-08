import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { WaitingEvaluationPage } from "./WaitingEvaluation";
import { WaitingResultPage } from "./WaitingResult";
import { EvaluationCompletePage } from "./EvaluationComplete";
import axios from "axios";
import { EventId, PATH_API } from "../../../constrant";
import { WaitingConfirmPage } from "./WaitingConfirm";

export const TeamStatusPage = () => {
  const [current, setCurrent] = useState(
    localStorage.getItem("teamStatusTab") || "1"
  );
  const onChange = (key) => {
    console.log(key);
    setCurrent(key);
    localStorage.setItem("teamStatusTab", key);
  };

  const items = [
    {
      key: "1",
      label: "รอประเมิน",
      children: <WaitingEvaluationPage />,
    },
    {
      key: "2",
      label: "รอประมวลผลคะแนน",
      children: <WaitingResultPage />,
    },
    {
      key: "4",
      label: "รอยืนยันผล",
      children: <WaitingConfirmPage />,
    },
    {
      key: "3",
      label: "ประเมินสำเร็จ",
      children: <EvaluationCompletePage />,
    },
  ];
  return <Tabs activeKey={current} items={items} onChange={onChange} />;
};
