import React from "react";
import { Row, Col, Card, Carousel, Typography, Image, Button } from "antd";
import { Link } from "react-router-dom";
import { authUser } from "../../constrant";
const { Title } = Typography;

export const Home = () => {
  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  const dummyNews = [
    { id: 1, title: "ข่าวที่ 1", description: "รายละเอียดของข่าวที่ 1" },
    { id: 2, title: "ข่าวที่ 2", description: "รายละเอียดของข่าวที่ 2" },
    { id: 3, title: "ข่าวที่ 3", description: "รายละเอียดของข่าวที่ 3" },
  ];

  return (
    <div className="home-body" style={{ padding: "20px" }}>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className="home-h1 ">
            <h1>
              <span className="orange">I</span>TED
            </h1>
            <h1>
              <span className="orange">M</span>EDIA{" "}
              <span className="orange">A</span>CADEMY
            </h1>
            <h1>
              <span className="orange">C</span>ONTEST{" "}
              <span className="orange">2025</span>
            </h1>
          </div>

          <p>
            We are the best way to organize <span className="orange">IMAC</span>{" "}
            events
          </p>
          <Row>
            {" "}
            {authUser ? null : (
              <Button
                href="/register"
                type="text"
                style={{
                  backgroundColor: "#ffa500",
                  color: "white",
                  margin: "5px",
                }}
              >
                Register
              </Button>
            )}
            <Button
              type="text"
              style={{
                borderColor: "#ffa500",
                margin: "5px",
                color: "white",
                borderWidth: "2px",
              }}
            >
              Submit
            </Button>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          {/* <Carousel style={{ width: "100%" }} afterChange={onChange}>
            <div>
              <h3 style={contentStyle}>1</h3>
            </div>
            <div>
              <h3 style={contentStyle}>2</h3>
            </div>
            <div>
              <h3 style={contentStyle}>3</h3>
            </div>
            <div>
              <h3 style={contentStyle}>4</h3>
            </div>
          </Carousel> */}
          <iframe
            width={"100%"}
            height={"500px"}
            loading="lazy"
            src="https://www.canva.com/design/DAGcyyBgSEQ/3-wTsX3V_8h1KQeJhZz6lA/watch?embed"
            allowfullscreen="allowfullscreen"
            allow="fullscreen"
          ></iframe>
        </Col>
      </Row>
    </div>
  );
};
