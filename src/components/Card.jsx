import React from 'react';
import { Card } from 'antd';
const { Meta } = Card;
const App = () => (
    <Card
    style={{
      background: "rgba(255, 255, 255, 0.08)", // ✅ ใส
      backdropFilter: "blur(8px)",             // ✅ เบลอ
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 12,
      color: "#fff",
      width: "100%",
      maxWidth: 350,
      padding: 16,
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    }}
    bodyStyle={{ background: "transparent" }} // ✅ ลบสีดำในเนื้อการ์ด
    cover={
      <img
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      />
    }
  >
    <Card.Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
  
  
);
export default App;