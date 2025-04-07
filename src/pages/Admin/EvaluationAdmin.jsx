import React, { useState, useEffect } from "react";
import TableComponent from "../../components/TableComponent";
import fetchSubmitForm from "../../services/EvaluationAdmin";
import handleDelete from "../../services/EvaluationAdmin";
import { Button } from "antd";
const EvaluationAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // กำหนดคอลัมน์ของตาราง
  const columns = [
    {
      title: "ชื่อผู้ส่ง",
      dataIndex: "directorName",
      key: "directorName",
    },
    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "formName",
      key: "formName",
    },
    {
      title: "วันที่ส่ง",
      dataIndex: "submittedAt",
      key: "submittedAt",
    },
    // {
    //   title: "คะเเนน",
    //   dataIndex: "evaluationResults",
    //   key: "evaluationResults",
    // },

    {
      title: "ผลการประเมิน",
      dataIndex: "evaluationResults",
      key: "evaluationResults",
      render: (evaluationResults, record) => {
        console.log("bead", record.criteria);
        console.log("beam2", evaluationResults);
        // สร้าง map: id (string) => name
        const criteriaMap = {};
        (record.criteria || []).forEach((item) => {
          criteriaMap[item.id.toString()] = item.name;
        });

        return Object.entries(evaluationResults)
          .map(([id, score]) => {
            const name = criteriaMap[id] || `ไม่ทราบหัวข้อ (${id})`;
            return `${name}: ${score}`;
          })
          .join(", ");
      },
    },

    // {
    //   title: "ผลการประเมิน",
    //   dataIndex: "evaluationResults",
    //   key: "evaluationResults",
    //   render: (evaluationResults) =>
    //     Object.values(evaluationResults).join(", "),
    // },

    {
      title: "actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleDelete(record.key)} // เรียกใช้ฟังก์ชันลบ
        >
          ลบ
        </Button>
      ),
    },
  ];

  // ดึงข้อมูลจาก Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchSubmitForm();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>ข้อมูลการส่งแบบฟอร์ม</h2>
      <TableComponent
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default EvaluationAdmin;
