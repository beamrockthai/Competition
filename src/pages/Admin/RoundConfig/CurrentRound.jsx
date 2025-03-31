import { Button, Card, Select, Spin } from "antd";
import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { EventId, PATH_API } from "../../../constrant";

export const CurrentRoundPage = () => {
  const dataFetchedRef = useRef(false);
  const [roundOptions, setRoundOptions] = useState([]);
  const [defaultRoundOptions, setDefaultRoundOptions] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loadings, setLoadings] = useState(false);

  const onSetCompetitionRound = async () => {
    setLoadings(true);
    const data = await axios.post(
      PATH_API + `/competition_rounds/updatecurrent/${selectedRound}`
    );
    console.log("onSetCompetitionRound", data);
    onGetRoundOptions();
    setLoadings(false);
  };
  const onGetRoundOptions = async () => {
    try {
      const { data } = await axios.get(
        PATH_API + `/competition_rounds/get/${EventId}`
      );
      console.log("data", data);

      setRoundOptions(data);
      const df = data.filter((e) => e.IsCurrent === "Yes");
      console.log("df", df);
      setDefaultRoundOptions(df);

      if (df.length > 0) {
        setSelectedRound(df[0].id); // ✅ กำหนดค่าเริ่มต้น
      }
    } catch (error) {
      console.error("Error fetching round options:", error);
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onGetRoundOptions();
  }, []);

  return (
    <>
      <Card>
        <h1>
          กำหนดรอบแข่งขัน -{" "}
          {defaultRoundOptions.length > 0 ? (
            defaultRoundOptions[0].Details
          ) : (
            <Spin />
          )}
        </h1>
        <Select
          style={{ width: 120 }}
          value={selectedRound} // ✅ ใช้ value แทน defaultValue
          onChange={(value) => setSelectedRound(value)} // ✅ อัปเดตค่าเมื่อเปลี่ยนรอบ
        >
          {roundOptions.map((e) => (
            <Select.Option key={e.id} value={e.id}>
              {e.Details}
            </Select.Option>
          ))}
        </Select>
        <Button
          loading={loadings}
          onClick={() => {
            onSetCompetitionRound();
          }}
        >
          บันทึก
        </Button>
      </Card>
    </>
  );
};
