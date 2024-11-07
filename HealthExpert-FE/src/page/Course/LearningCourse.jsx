import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, Modal } from "antd";
import ModalNutriRecommend from "./NutriRecommend";
import BMIModal from "../../components/ModelUpdateBMI";

export default function LearningCourse() {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [lessons, setLessons] = useState({});
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentLesson, setCurrentLesson] = useState('');
  const [currentLessonCover, setCurrentLessonCover] = useState('');
  const [currentSession, setCurrentSession] = useState('');
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const { SubMenu } = Menu;
  const [isPlaying, setIsPlaying] = useState(false);
  const localAccount = localStorage.getItem("accountId");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const fetchCourse = async () => {
    try {
      const sessionResponse = await axios.get("https://localhost:7158/api/Session/GetSessions");
      const foundSessions = sessionResponse.data.filter(session => session.courseId === id);
      setSessions(foundSessions.length > 0 ? foundSessions : [{ sessionName: "Failed to get sessions" }]);

      // Fetch lessons
      const lessonResponse = await axios.get("https://localhost:7158/api/Lesson/GetLessons");
      const lessonsData = lessonResponse.data.reduce((acc, lesson) => {
        if (!acc[lesson.sessionId]) {
          acc[lesson.sessionId] = [];
        }
        acc[lesson.sessionId].push(lesson);
        return acc;
      }, {});
      setLessons(lessonsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const getCurrentProgress = async () => {
    try {
      const response = await axios.get(`https://localhost:7158/api/Course/current-progress/${localAccount}?courseId=${id}`);
      if (response.data.length > 0) {
        const currentProgress = response.data[0];
        setCurrentSession(currentProgress.currentSessionId);
        setCurrentLesson(currentProgress.currentLessonId);
  
        // Get the current lesson from lessons data
        const lessonResponse = await axios.get("https://localhost:7158/api/Lesson/GetLessons");
        const foundLesson = lessonResponse.data.find(lesson => lesson.lessonId === currentProgress.currentLessonId);
        if (foundLesson) {
          // Cập nhật URL video cho đúng
          setCurrentVideo(`https://localhost:7158/api/Lesson/GetVideo/${currentProgress.currentLessonId}`);
          setCurrentLessonCover(foundLesson.cover);
        }
      }
    } catch (error) {
      console.error("Error fetching current progress:", error);
    }
  };


  useEffect(() => {
    getCurrentProgress();
  }, []);

  const updateProgress = async (accountId, courseId, sessionId, lessonId) => {
    try {
      await axios.post(`https://localhost:7158/api/Course/update-progress/${accountId}`, {
        courseId: courseId,
        sessionId: sessionId,
        lessonId: lessonId
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleMenuClick = (e) => {
    const [sessionIndex, lessonIndex] = e.key.split('-').slice(1);
    const selectedLesson = lessons[sessions[sessionIndex].sessionId][lessonIndex];
    setCurrentSession(sessions[sessionIndex].sessionId);
    setCurrentVideo(`https://localhost:7158/api/Lesson/GetVideo/${selectedLesson.lessonId}`); // Update video URL based on selected lesson
    setCurrentLessonCover(selectedLesson.cover);
    setCurrentLesson(selectedLesson.lessonId);
    updateProgress(localAccount, id, sessions[sessionIndex].sessionId, selectedLesson.lessonId);
  };

  const getLastLessonId = () => {
    if (sessions.length === 0) return null;
    const lastSessionId = sessions[sessions.length - 1].sessionId;
    const lastSessionLessons = lessons[lastSessionId];
    return lastSessionLessons && lastSessionLessons.length > 0 ? lastSessionLessons[lastSessionLessons.length - 1].lessonId : null;
  };

  const handleOk = async () => {
    const accountId = localStorage.getItem("accountId");
    const createDate = new Date().toISOString();
    try {
      await axios.post("https://localhost:7158/api/BMI", {
        weight,
        height,
        createDate,
        accountId,
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating BMI: ", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="w-full home-page">
        <Header />
      </div>

      <div className="flex justify-end ml-5 mt-16">
        <div className="w-[80%] flex flex-col">
          <div className="bg-black w-full h-[620px] flex justify-center items-center">
            <div>
              <video src={currentVideo} controls={true} autoPlay={isPlaying}
                className="w-full h-[600px]" />
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-[20px] font-bold">Lời khuyên của bài học:</h2>
            <br />
            <h2 className="text-[20px]">{currentLessonCover}</h2>
          </div>
          <div className="flex flex-row justify-between">
            <button
              onClick={() => setIsRecommendModalOpen(true)}
              className="w-[250px] mr-[90px] rounded-md bg-orange-400 hover:bg-black text-white font-bold py-3 px-4 rounded opacity-100 hover:opacity-80 transition-opacity mt-3"
            >
              Đề xuất dinh dưỡng
            </button>
            {currentLesson === getLastLessonId() && (
              <button
                onClick={showModal}
                className="w-[250px] mr-[90px] rounded-md bg-orange-400 hover:bg-black text-white font-bold py-3 px-4 rounded opacity-100 hover:opacity-80 transition-opacity mt-3"
              >
                Hoàn thành khóa học
              </button>
            )}
          </div>
        </div>

        <Modal
          open={isRecommendModalOpen}
          onCancel={() => setIsRecommendModalOpen(false)}
          footer={null}
        >
          <ModalNutriRecommend sessionId={currentSession} />
        </Modal>
        <BMIModal
          isVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          weight={weight}
          setWeight={setWeight}
          height={height}
          setHeight={setHeight}
        />
        <div className="w-[20%] ">
          <Menu mode="inline" onClick={handleMenuClick}>
            {sessions.map((session, index) => (
              <SubMenu key={`session-${index}`} title={`${session.sessionName}`}>
                {lessons[session.sessionId] && lessons[session.sessionId].map((lesson, lessonIndex) => (
                  <Menu.Item key={`lesson-${index}-${lessonIndex}`}>{lesson.caption}</Menu.Item>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </div>
      </div>
    </>
  );
}
