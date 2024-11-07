import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menuleft from "../../components/MenuLeft";
import Header from "../../components/Header";
import { Table, Modal, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LearnerManagement() {
  const { courseId } = useParams();
  const [course, setCourse] = useState([]);
  const [learners, setLearners] = useState([]);
  const [isLearnerModalVisible, setIsLearnerModalVisible] = useState(false);
  const navigate = useNavigate();
  const [checkManager, setCheckManager] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    const roleIdFromLocalStorage = localStorage.getItem("roleId");
    setRoleId(roleIdFromLocalStorage);
    const teacherIdFromLocalStorage = localStorage.getItem("teacherId");
    setTeacherId(teacherIdFromLocalStorage);

    if (roleIdFromLocalStorage && roleIdFromLocalStorage === "3") {
      setCheckManager(true);
    }
    if (roleIdFromLocalStorage && roleIdFromLocalStorage === "4") {
      navigate('/home');
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teacherIdFromLocalStorage = localStorage.getItem("teacherId");
        const courseRes = await axios.get(`https://localhost:7158/api/Course/courses/${teacherIdFromLocalStorage}`);
        setCourse(courseRes.data);
        console.log(courseRes.data);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    fetchCourses();
  }, []);

  // Function to fetch learners for a specific course
  const fetchLearners = async (courseId) => {
    try {
      const learnersRes = await axios.get(`https://localhost:7158/api/course/${courseId}/users`);
      setLearners(learnersRes.data);
      setIsLearnerModalVisible(true);
    } catch (error) {
      console.error("Error fetching learners: ", error);
    }
  };

  const fetchAccountIdByUserName = async (userName) => {
    try {
      const response = await axios.get(`https://localhost:7158/api/Account/GetAccountIdByUserName/${userName}`);
      const accountId = response.data;
      navigate(`/schedule/${accountId}`);
    } catch (error) {
      console.error("Error fetching account ID: ", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const learnerColumns = [
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
      render: (text) => (
        <a onClick={() => fetchAccountIdByUserName(text)}>{text}</a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Ngày tham gia",
      dataIndex: "enrollDate",
      key: "enrollDate",
      render: (text) => formatDate(text),
    }
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "courseId",
      key: "courseId",
      render: (text, record) => (
        <a onClick={() => fetchLearners(record.courseId)}>{record.courseId}</a>
      ),
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Số lượng học viên",
      dataIndex: "studentNumber",
      key: "studentNumber",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span>{new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text)}</span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <>
      <div className="w-full">
        <Header />
      </div>
      <div className="w-full flex mt-16">
        <div className="w-[20%] h-full">
          <div className="home-page">
            <Menuleft />
          </div>
        </div>
        <div className="w-full top-30 mt-10">
          <Table
            columns={columns}
            dataSource={course}
            rowKey={(record) => record.courseId}
          />
        </div>
      </div>

      {/* Modal to display learners */}
      <Modal
        title="Danh sách học viên"
        visible={isLearnerModalVisible}
        onCancel={() => setIsLearnerModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsLearnerModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <Table
          columns={learnerColumns}
          dataSource={learners}
          rowKey={(record) => record.userId}
          pagination={false}
        />
      </Modal>
    </>
  );
}
