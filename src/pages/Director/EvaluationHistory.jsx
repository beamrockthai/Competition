import axios from "axios";
import { EventId, PATH_API } from "../../constrant";
import { useEffect, useState } from "react";
// import { Form } from "react-router-dom"
import { Form, Button, Col, InputNumber, Row } from "antd";

export const EvaluationHistoryPage = (props) => {
  const [form] = Form.useForm();
  const data = props.data;
  const onFinish = async (val) => {
    console.log(val);
  };
  const [evaluationAnswer, setEvaluationAnswer] = useState();
  const getEvaluationAnswer = async () => {
    const ansdata = await axios.get(
      PATH_API +
        `/evaluation_answers/getbyteam/${data.GroupId}/55/${data.CompetitionTypeId}/${data.CompetitionRoundId}/${EventId}`
    );
    console.log("getEvaluationAnswer", data);
    setEvaluationAnswer(data.data);

    const mapData = ansdata.data.map((e) => ({
      Question: e.evaluation_question.Question,
      Score: e.Score,
      MinScore: e.evaluation_question.MinScore,
      MaxScore: e.evaluation_question.MaxScore,
    }));
    console.log("hhhhhhhhhh", mapData);
    form.setFieldValue("evaluation_question", mapData);
  };
  useEffect(() => {
    getEvaluationAnswer();
  }, []);
  return (
    <>
      {/* {JSON.stringify(data)} */}
      <Form
        form={form}
        name="evaluation_form"
        // labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="evaluation_question">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item
                      label={
                        form.getFieldValue([
                          "evaluation_question",
                          name,
                          "Question",
                        ]) || "คำถาม"
                      }
                      name={[name, "Question"]}
                    ></Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "Score"]}
                      rules={[{ required: true, message: "กรุณากรอกคะแนน" }]}
                    >
                      <InputNumber
                        disabled={true}
                        min={
                          form.getFieldValue([
                            "evaluation_question",
                            name,
                            "MinScore",
                          ]) ?? 0
                        }
                        max={
                          form.getFieldValue([
                            "evaluation_question",
                            name,
                            "MaxScore",
                          ]) ?? 100
                        }
                        placeholder="กรอกคะแนน"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <p>
                      คะแนนเต็ม:{" "}
                      {form.getFieldValue([
                        "evaluation_question",
                        name,
                        "MaxScore",
                      ]) ?? "ไม่ระบุ"}
                    </p>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form.List>

        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            ส่งแบบประเมิน
          </Button>
        </Form.Item> */}
      </Form>
    </>
  );
};
