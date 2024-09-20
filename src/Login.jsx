import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
// import { Link } from "react-router-dom";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();

  // Declare States
  const [optCode, setOTPCode] = useState("");
  const [getAllData, setAllData] = useState();
  const navigate = useNavigate();

  //   UseEffect
  useEffect(() => {
    const getUserCode = axios
      .get("https://664ecb82fafad45dfae11b43.mockapi.io/UserCode")
      .then((res) => {
        setAllData(res.data);
      })
      .catch((err) => {
        console.log("Error... while getting the user code", err);
      });
  }, []);

  // onChange OTP
  const onEnterOTP = (text) => {
    setOTPCode(text);
  };

  // onVerify Button
  const onVerify = () => {
    if (optCode != "") {
      const checkCode = getAllData.filter((val) => {
        return val.UserCode == optCode;
      });
      console.log(checkCode);
      checkCode.length >= 1
        ? navigate("/Timer", { state: optCode })
        : messageApi.open({
            type: "error",
            content: "Opps... Invalid Code",
          });
    } else {
      messageApi.open({
        type: "error",
        content: "Please Enter Verify Code",
      });
    }
  };

  return (
    <div>
      {contextHolder}

      <Form
        className="myLoginForm"
        name="login"
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: 360,
        }}
      >
        <div className="iconContainer">
          <SafetyCertificateOutlined />
        </div>
        <label className="loginHeader">Enter Code</label>

        <Form.Item name="password" style={{ marginTop: "20px" }}>
          <Input.OTP length={4} onChange={onEnterOTP} inputMode="numeric" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" onClick={onVerify}>
            Verify Code
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
