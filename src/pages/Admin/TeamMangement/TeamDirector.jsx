// import { Button, Form, Popconfirm, Select, Space } from "antd";
// import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { PATH_API } from "../../../constrant";
// import { useEffect, useState } from "react";

// export const TeamDirectorPage = (props) => {
//   const [directorData, setDirectorData] = useState([]);
//   const [form] = Form.useForm();
//   const teamData = props.data;
//   const [defaultRoundOptions, setDefaultRoundOptions] = useState([]);

//   const [roundOptions, setRoundOptions] = useState([]);

//   const [selectedRound, setSelectedRound] = useState();
//   const getDirectorwithGroup = async (value) => {
//     console.log("getDirectorwithGroup", selectedRound);
//     setSelectedRound();

//     setSelectedRound(value);
//     const data = await axios.get(
//       PATH_API +
//         `/director_with_groups/getbyteam/${teamData.id}/${selectedRound}`
//     );
//     form.setFieldValue("users", data.data);
//     console.log("getDirectorwithGroup", data);
//   };
//   const onGetRoundOptions = async () => {
//     try {
//       const { data } = await axios.get(PATH_API + `/competition_rounds/get`);
//       console.log("data", data);

//       setRoundOptions(data);
//       const df = data.filter((e) => e.IsCurrent === "Yes");
//       console.log("df", df);
//       setDefaultRoundOptions(df[0].id);

//       if (df.length > 0) {
//         setSelectedRound(df[0].id); // ✅ กำหนดค่าเริ่มต้น
//         form.setFieldsValue({ CompetitionRoundId: df[0].id });
//         getDirectorwithGroup(df[0].id);
//       }
//     } catch (error) {
//       console.error("Error fetching round options:", error);
//     }
//   };
//   const onFinish = async (values) => {
//     console.log(values);

//     for (var i = 0; i < values.users.length; i++) {
//       console.log(values.users[i]);

//       await axios
//         .post(PATH_API + `/director_with_groups/create`, {
//           DirectorId: values.users[i].DirectorId,
//           CompetitionRoundId: values.CompetitionRoundId,
//           CompetitionTypeId: values.CompetitionTypeId,
//           GroupId: teamData.id,
//         })
//         .then((res) => {
//           console.log(res);
//         });
//     }
//   };
//   const getDirector = async () => {
//     const data = await axios.get(PATH_API + `/users/getbyrole/3`);
//     const ddata = data.data.map((e) => ({
//       value: e.id,
//       label: `${e.FirstName} ${e.LastName}`,
//     }));
//     setDirectorData(ddata);
//   };
//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };
//   const confirmDelete = (name, remove) => {
//     const memberId = form.getFieldValue(["users", name, "id"]); // ดึงค่า ID

//     console.log("Deleting member with ID:", memberId);

//     if (memberId) {
//       axios
//         .post(`${PATH_API}/director_with_groups/delete/${memberId}`)
//         .then((res) => {
//           console.log("Deleted successfully:", res);
//           remove(name); // ลบออกจาก UI หลังจากลบ API สำเร็จ
//         })
//         .catch((err) => {
//           console.error("Error deleting member:", err);
//         });
//     } else {
//       remove(name); // ถ้าไม่มี ID ก็ลบแค่ใน UI
//     }
//   };
//   useEffect(() => {
//     onGetRoundOptions();
//     getDirector();
//     getDirectorwithGroup();
//   }, []);

//   return (
//     <>
//       {" "}
//       {JSON.stringify(selectedRound)}
//       <Form
//         form={form} // ใช้ form instance
//         name="dynamic_form_nest_item"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         style={{ maxWidth: 600 }}
//         autoComplete="off"
//       >
//         <Form.Item label="รอบการแข่งขัน" name="CompetitionRoundId">
//           <Select
//             style={{ width: 120 }}
//             // value={selectedRound} // ✅ ใช้ value แทน defaultValue
//             onChange={(value) => getDirectorwithGroup(value)} // ✅ อัปเดตค่าเมื่อเปลี่ยนรอบ
//           >
//             {roundOptions.map((e) => (
//               <Select.Option key={e.id} value={e.id}>
//                 {e.Details}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.List name="users">
//           {(fields, { add, remove }) => {
//             // ดึงค่าที่ถูกเลือกไปแล้ว
//             const selectedValues =
//               form
//                 .getFieldValue("users")
//                 ?.map((item) => item?.first)
//                 .filter(Boolean) || [];

//             return (
//               <>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Space
//                     key={key}
//                     style={{ display: "flex", marginBottom: 8 }}
//                     align="baseline"
//                   >
//                     <Form.Item
//                       {...restField}
//                       name={[name, "DirectorId"]}
//                       rules={[{ required: true, message: "กรุณาเลือกกรรมการ" }]}
//                     >
//                       <Select
//                         showSearch
//                         style={{ width: 200 }}
//                         placeholder="กรรมการ"
//                         optionFilterProp="label"
//                         // ฟิลเตอร์เอารายการที่ถูกเลือกออก
//                         options={directorData.filter(
//                           (option) => !selectedValues.includes(option.value)
//                         )}
//                       />
//                     </Form.Item>

//                     <Popconfirm
//                       title="คุณแน่ใจหรือไม่ที่จะลบ?"
//                       okText="ใช่"
//                       cancelText="ยกเลิก"
//                       onConfirm={() => confirmDelete(name, remove)}
//                     >
//                       <MinusCircleOutlined style={{ color: "red" }} />
//                     </Popconfirm>
//                   </Space>
//                 ))}
//                 <Form.Item>
//                   <Button
//                     type="dashed"
//                     onClick={() => add()}
//                     block
//                     icon={<PlusOutlined />}
//                   >
//                     เพิ่มกรรมการ
//                   </Button>
//                 </Form.Item>
//               </>
//             );
//           }}
//         </Form.List>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             บันทึกกรรมการ
//           </Button>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };
import { Button, Form, Popconfirm, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { PATH_API } from "../../../constrant";
import { useEffect, useState } from "react";

export const TeamDirectorPage = (props) => {
  const [directorData, setDirectorData] = useState([]);
  const [form] = Form.useForm();
  const teamData = props.data;
  const [defaultRoundOptions, setDefaultRoundOptions] = useState([]);
  const [roundOptions, setRoundOptions] = useState([]);
  const [selectedRound, setSelectedRound] = useState();

  const getDirectorwithGroup = async (roundId) => {
    console.log("getDirectorwithGroup", roundId); // ตรวจสอบค่าที่ส่งเข้ามา
    setSelectedRound(roundId); // ✅ อัปเดต selectedRound

    const data = await axios.get(
      PATH_API + `/director_with_groups/getbyteam/${teamData.id}/${roundId}`
    );
    const mapData = data.data.map((e)=>({
      ...e,
      DirectorName:e.user.FirstName+" "+ e.user.LastName
  }))
    form.setFieldValue("users", mapData);
    console.log("getDirectorwithGroup", mapData);
  };

  const onGetRoundOptions = async () => {
    try {
      const { data } = await axios.get(PATH_API + `/competition_rounds/get`);
      console.log("data", data);

      setRoundOptions(data);
      const df = data.filter((e) => e.IsCurrent === "Yes");
      console.log("df", df);
      setDefaultRoundOptions(df[0].id);

      if (df.length > 0) {
        setSelectedRound(df[0].id); // ✅ กำหนดค่าเริ่มต้น
        form.setFieldsValue({ CompetitionRoundId: df[0].id });
        getDirectorwithGroup(df[0].id); // ส่งค่าเริ่มต้นให้กับฟังก์ชัน
      }
    } catch (error) {
      console.error("Error fetching round options:", error);
    }
  };

  const onFinish = async (values) => {
    console.log(values);

    for (var i = 0; i < values.users.length; i++) {
      console.log(values.users[i]);

      await axios
        .post(PATH_API + `/director_with_groups/create`, {
          DirectorId: values.users[i].DirectorId,
          CompetitionRoundId: values.CompetitionRoundId,
          CompetitionTypeId: values.CompetitionTypeId,
          GroupId: teamData.id,
        })
        .then((res) => {
          console.log(res);
        });
    }
  };

  const getDirector = async () => {
    const data = await axios.get(PATH_API + `/users/getbyrole/3`);
    const ddata = data.data.map((e) => ({
      value: e.id,
      label: `${e.FirstName} ${e.LastName}`,
    }));
    setDirectorData(ddata);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const confirmDelete = (name, remove) => {
    const memberId = form.getFieldValue(["users", name, "id"]); // ดึงค่า ID

    console.log("Deleting member with ID:", memberId);

    if (memberId) {
      axios
        .post(`${PATH_API}/director_with_groups/delete/${memberId}`)
        .then((res) => {
          console.log("Deleted successfully:", res);
          remove(name); // ลบออกจาก UI หลังจากลบ API สำเร็จ
        })
        .catch((err) => {
          console.error("Error deleting member:", err);
        });
    } else {
      remove(name); // ถ้าไม่มี ID ก็ลบแค่ใน UI
    }
  };

  useEffect(() => {
    onGetRoundOptions();
    getDirector();
  }, []); // เพิ่ม useEffect ให้ทำงานเพียงครั้งเดียวตอนเริ่มต้น

  return (
    <>
      {JSON.stringify(selectedRound)}
      <Form
        form={form} // ใช้ form instance
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item label="รอบการแข่งขัน" name="CompetitionRoundId">
          <Select
            style={{ width: 120 }}
            value={selectedRound} // ใช้ value แทน defaultValue
            onChange={(value) => getDirectorwithGroup(value)} // เมื่อเลือกใหม่เรียก getDirectorwithGroup
          >
            {roundOptions.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.Details}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="users">
          {(fields, { add, remove }) => {
            // ดึงค่าที่ถูกเลือกไปแล้ว
            const selectedValues =
              form
                .getFieldValue("users")
                ?.map((item) => item?.DirectorId)
                .filter(Boolean) || [];

            return (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "DirectorName"]}
                      rules={[{ required: true, message: "กรุณาเลือกกรรมการ" }]}
                    >
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="กรรมการ"
                        optionFilterProp="label"
                        // ฟิลเตอร์เอารายการที่ถูกเลือกออก
                        options={directorData.filter(
                          (option) => !selectedValues.includes(option.value)
                        )}
                      />
                    </Form.Item>

                    <Popconfirm
                      title="คุณแน่ใจหรือไม่ที่จะลบ?"
                      okText="ใช่"
                      cancelText="ยกเลิก"
                      onConfirm={() => confirmDelete(name, remove)}
                    >
                      <MinusCircleOutlined style={{ color: "red" }} />
                    </Popconfirm>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    เพิ่มกรรมการ
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            บันทึกกรรมการ
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
