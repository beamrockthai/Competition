import React from "react";
import { Button, Card, Flex, Typography } from "antd";
import { color } from "chart.js/helpers";

const cardStyle = {
  width: 620,
  maxWidth: "100%", // ทำให้ responsive
};

const imgStyle = {
  display: "block",
  width: 273,
  maxWidth: "100%", // ทำให้ภาพ responsive ด้วย
  height: "auto",
};

const mockupData = [
  {
    title: "ส่งเสริมสุขภาพร่างกาย",
    image:
      "https://img.freepik.com/free-vector/fitness-concept-illustration_114360-1045.jpg",
    text: "“การเล่นกีฬาช่วยให้ร่างกายแข็งแรง ระบบไหลเวียนเลือดดี ลดความเสี่ยงต่อโรคต่าง ๆ”",
    link: "https://hpc11.anamai.moph.go.th/th/sa-suk-11/200024",
  },
  {
    title: "พัฒนาทักษะสังคม",
    image:
      "https://img.freepik.com/free-vector/people-playing-basketball-park_23-2148649743.jpg",
    text: "“การเล่นกีฬาฝึกการทำงานเป็นทีม มีน้ำใจนักกีฬา และสร้างมิตรภาพกับผู้อื่น”",
    link: "https://www.trueplookpanya.com/knowledge/content/61089/-blo-soccer-sports",
  },
];

const CardGet = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "24px",
        padding: "40px 16px",
      }}
    >
      {mockupData.map((item, index) => (
        <Card
          key={index}
          hoverable
          style={{
            ...cardStyle,
            marginTop: "0px", // ถ้าใช้ Flex gap แล้ว ไม่ต้องใช้ marginTop
          }}
          styles={{ body: { padding: 0, overflow: "hidden" } }}
        >
          <Flex
            justify="space-between"
            wrap="wrap"
            style={{ flexDirection: "row" }}
          >
            <img alt="avatar" src={item.image} style={imgStyle} />
            <Flex
              vertical
              align="flex-end"
              justify="space-between"
              style={{ padding: 24, flex: 1 }}
            >
              <Typography.Title level={4}>{item.text}</Typography.Title>
              <Button type="Danger" href={item.link} target="_blank">
                {item.title}
              </Button>
            </Flex>
          </Flex>
        </Card>
      ))}
    </div>
  );
};

export default CardGet;
