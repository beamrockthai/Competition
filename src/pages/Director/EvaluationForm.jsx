import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
} from "antd";
import axios from "axios";
import { PATH_API } from "../../constrant";
import { useEffect, useState } from "react";

export const EvaluationForm = (props) => {
  const [form] = Form.useForm();
  const data = props.data;
const[evaluationForms,setEvaluationForms] = useState()
  const onFinish = async (values) => {
    console.log("Success:", values);
    for (let i = 0; i < values.evaluation_question.length; i++) {
      const rawdata = {
        ...values.evaluation_question[i],
        EvaluationQuestionId: values.evaluation_question[i].id,
        GroupId:data.GroupId,
        CompetitionRoundId:data.CompetitionRoundId,
        CompetitionTypeId:data.CompetitionTypeId,
EvaluationFormId:evaluationForms
      };
      console.log("rawdata",rawdata);
      
      try {
        const res = await axios.post(PATH_API + `/evaluation_answers/create`, rawdata);
        console.log(res);
      } catch (error) {
        console.error("Error submitting evaluation:", error);
      }
    }
  };

  const getEvaluationForm = async () => {
    if (!data) return;
    try {
      form.resetFields()
      const newdata = await axios.get(
        PATH_API +
          `/evaluation_forms/getby/${data.CompetitionRoundId}/${data.CompetitionTypeId}`
      );
      setEvaluationForms(newdata)
      console.log("newdata", newdata);

      const questionData = await axios.get(
        PATH_API + `/evaluation_questions/getbyform/52`
      );
      console.log("questionData", questionData.data);

      form.setFieldsValue({ evaluation_question: questionData.data });
    } catch (error) {
      console.error("Error fetching evaluation form:", error);
    }
  };

  useEffect(() => {
    getEvaluationForm();
  }, [data]); // ✅ รันใหม่เมื่อ data เปลี่ยน
  return (
    <>
    {JSON.stringify(data)}
      <h2>ท่านกำลังประเมินทีม {data?.TeamName}</h2>
      <h2>การแข่งขันประเภท : {data?.CompetitionType}</h2>
      <h2>รอบที่ : {data?.CompetitionRound}</h2>
      <Form
        form={form}
        name="evaluation_form"
        labelCol={{ span: 8 }}
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
                      label={form.getFieldValue(["evaluation_question", name, "Question"]) || "คำถาม"}
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
                        min={form.getFieldValue(["evaluation_question", name, "MinScore"]) ?? 0}
                        max={form.getFieldValue(["evaluation_question", name, "MaxScore"]) ?? 100}
                        placeholder="กรอกคะแนน"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <p>คะแนนเต็ม: {form.getFieldValue(["evaluation_question", name, "MaxScore"]) ?? "ไม่ระบุ"}</p>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            ส่งแบบประเมิน
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
