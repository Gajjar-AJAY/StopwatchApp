import React from "react";
import { useState, useEffect, useRef } from "react";
import { Select, Space, Modal, message, Table, Empty, Button } from "antd";
import axios from "axios";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  CheckCircleFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
function Timer() {
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const UserCode = location.state;
  // declare States
  const [isRuning, setIsRuning] = useState(false);
  const [elsapeTime, setElapsedTime] = useState(0);
  const [isStoreTime, setIsStoreTime] = useState(false);
  const [isShowData, setIsShowData] = useState(false);
  const [showData, setShowData] = useState([]);
  const [totalTime, setTotalTime] = useState({
    breakType: "",
    breakTotalTime: null,
  });

  // References
  const interverRef = useRef(null);
  const statTimeRef = useRef(0);
  const currentTime = useRef(null);

  // Table Headers
  const columns = [
    {
      title: "Break Type",
      dataIndex: "breakType",
      key: "breakType",
    },
    {
      title: "Break Time",
      dataIndex: "breakTime",
      key: "breakTime",
    },
  ];

  // Declare useEffeact
  useEffect(() => {
    // Get Data From DB
    const getData = axios
      .get(`https://664ecb82fafad45dfae11b43.mockapi.io/BreakTime`)
      .then((rep) => {
        if (rep.data.length >= 1) {
          const setData = [];
          const getCurrentDate = onCurrentDate();
          const getTodayData = rep.data.filter((data) => {
            return (
              data.storeValue.Date == getCurrentDate &&
              data.storeValue.UserCode == UserCode
            );
          });

          if (getTodayData.length >= 1) {
            getTodayData.map((e) => {
              setData.push({
                key: e.id,
                breakType: e.storeValue.BreakType,
                breakTime: e.storeValue.BreakTime,
              });
            });
            setShowData(setData);
          }
        }
      });

    if (isRuning) {
      interverRef.current = setInterval(() => {
        setElapsedTime(Date.now() - statTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(interverRef.current);
    };
  }, [isRuning]);

  // Start Time
  function onStartTime() {
    setIsRuning(true);
    setIsStoreTime(false);

    statTimeRef.current = Date.now() - elsapeTime;
  }

  // Stop Time
  function onStopTime() {
    setIsRuning(false);
  }

  // Restart Time
  function onRestartTime() {
    let tempTimeStore = { ...totalTime };
    tempTimeStore.breakTotalTime = currentTime.current;
    if (currentTime.current != "00: 00: 00") {
      setTotalTime(tempTimeStore);
      setElapsedTime(0);
      setIsRuning(false);
      setIsStoreTime(true);
    } else {
      messageApi.open({
        type: "error",
        content: "Please Start The Time",
      });
    }
  }

  // Show Table
  function onShowData() {
    setIsShowData(true);
  }

  // Create Today's Data
  function onCurrentDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    const fulldate = day + "-" + month + "-" + year;
    return fulldate;
  }

  //  Store Value
  function onStoreValue() {
    let tempTotalValue = { ...totalTime };
    let fulldate = onCurrentDate();
    let storeValue = {
      BreakType: tempTotalValue.breakType,
      BreakTime: tempTotalValue.breakTotalTime,
      Date: fulldate,
      UserCode: UserCode,
    };
    if (tempTotalValue.breakType == "") {
      messageApi.open({
        type: "error",
        content: "Please select the break type",
      });
    } else {
      try {
        const saveData = axios
          .post(`https://664ecb82fafad45dfae11b43.mockapi.io/BreakTime`, {
            storeValue,
          })
          .then(() => {
            setIsStoreTime(false);
            messageApi.open({
              type: "success",
              content: "Break Time Added !",
            });
          });
      } catch (err) {
        console.log("Err... For Storing Break Time Data !!");
      }
    }
  }

  // Formate Time
  function formateTime() {
    let hours = Math.floor(elsapeTime / (1000 * 60 * 60));
    let minutes = Math.floor((elsapeTime / (1000 * 60)) % 60);
    let second = Math.floor((elsapeTime / 1000) % 60);
    let milisecomd = Math.floor((elsapeTime % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    second = String(second).padStart(2, "0");
    milisecomd = String(milisecomd).padStart(2, "0");

    currentTime.current = `${hours}: ${minutes}: ${second}`;
    return `${hours}: ${minutes}: ${second}`;
  }

  // OnSelect Dropdown
  const handleChange = (value) => {
    let tempTimeStore = { ...totalTime };
    tempTimeStore.breakType = value;
    setTotalTime(tempTimeStore);
    console.log(`selected ${value}`);
  };
  return (
    <div className="stopwatch-container">
      {contextHolder}

      <label className="header">Break Time</label>
      <p className="timer">{formateTime()}</p>
      <div className="stopwatch-buttons">
        {/* <button>Start</button> */}
        <PlayCircleFilled
          onClick={onStartTime}
          style={{ color: "green", fontSize: "50px" }}
        />

        <PauseCircleFilled
          onClick={onStopTime}
          style={{ color: "red", fontSize: "50px" }}
        />

        <CheckCircleFilled
          onClick={onRestartTime}
          style={{ color: "#F97300", fontSize: "50px" }}
        />
        <ClockCircleFilled
          onClick={onShowData}
          style={{ color: "#7B113A", fontSize: "50px" }}
        />
      </div>
      {isStoreTime ? (
        <Modal
          title="Kindly, Select the break type and click on OK"
          centered
          open={isStoreTime}
          //   onOk={() => onStoreValue()}
          onCancel={() => setIsStoreTime(false)}
          width={1000}
          className="saveModel"
        >
          <Space wrap>
            <Select
              style={{
                width: 120,
              }}
              placeholder={"Lunch Break"}
              onChange={handleChange}
              options={[
                {
                  value: "Lunch Break",
                  label: "Lunch Break",
                },
                {
                  value: "Evening Break",
                  label: "Evening Break",
                },
                {
                  value: "OutSide Break",
                  label: "OutSide Break",
                },
              ]}
            />
          </Space>

          <Button onClick={() => onStoreValue()} className="saveBtn">
            Submit
          </Button>
        </Modal>
      ) : undefined}

      {/* Show Data Table */}
      {isShowData ? (
        <Modal
          title="Today's All Break Detail"
          centered
          open={isShowData}
          onOk={() => setIsShowData(false)}
          onCancel={() => setIsShowData(false)}
          width={1000}
        >
          {showData.length != 0 ? (
            <Table columns={columns} dataSource={showData} />
          ) : (
            <Empty />
          )}
        </Modal>
      ) : undefined}
    </div>
  );
}

export default Timer;
