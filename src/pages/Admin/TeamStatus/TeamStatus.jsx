import React, { useEffect } from "react";
import { Tabs } from "antd";
import { WaitingEvaluationPage } from "./WaitingEvaluation";
import { WaitingResultPage } from "./WaitingResult";
import { EvaluationCompletePage } from "./EvaluationComplete";
import axios from "axios";
import { EventId, PATH_API } from "../../../constrant";

export const TeamStatusPage = () => {
  const onChange = (key) => {
    console.log(key);
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
      key: "3",
      label: "ประเมินสำเร็จ",
      children: <EvaluationCompletePage />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};
