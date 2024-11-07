import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Menu } from "antd";

const Menuleft = () => {
  const navigate = useNavigate();
  const [checkCurrentCourse, setCheckCurrentCourse] = useState(false);
  const [checkCurrentSession, setCheckCurrentSession] = useState(false);
  const [roleId, setRoleId] = useState("");
  const currentCourse = localStorage.getItem("currentCourse");
  const currentSession = localStorage.getItem("currentSession");
  const user = localStorage.getItem("user");
  const [checkServiceCenter, setCheckServiceCenter] = useState(false);

  useEffect(() => {
    const roleIdFromLocalStorage = localStorage.getItem("roleId");
    setRoleId(roleIdFromLocalStorage);

    if (roleIdFromLocalStorage === "3") {
      navigate("/teacher");
    } else if (roleIdFromLocalStorage === "2") {
      setCheckServiceCenter(true);
    } else {
      navigate("/home");
    }

    if (currentCourse === null) {
      setCheckCurrentCourse(true);
    } else setCheckCurrentCourse(false);

    if (currentSession === null) {
      setCheckCurrentSession(true);
    } else setCheckCurrentSession(false);
  }, [navigate]);

  const navigateToManageCourse = () => {
    navigate("/manageCourse");
  };

  const navigateToManageCenter = () => {
    navigate("/manageCenter");
  };

  const navigateToManagePost = () => {
    navigate("/managePost");
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-15 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-orange-400">
          <ul className="space-y-6 font-medium bg-orange-400">
            {roleId === "3" ? (
              <>
                <div>
                  <a
                    href="/teacher"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="w-5 h-5 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 5h10v10H5V5z" />
                    </svg>
                    <span className="ms-3 font-bold">Khóa học</span>
                  </a>
                </div>
                <div>
                  <a
                    href={`/schedule`}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="w-5 h-5 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 5h10v10H5V5z" />
                    </svg>
                    <span className="ms-3 font-bold">Lịch dạy học</span>
                  </a>
                </div>
              </>
            ) : (
              <>
                <div>
                  <a
                    href="/manageCourse"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="w-5 h-5 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="ms-3 font-bold">Khóa học</span>
                  </a>
                </div>
                {checkCurrentCourse ? null : (
                  <a
                    href={`/manageSession/${currentCourse}`}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap font-bold">Buổi học</span>
                  </a>
                )}
                {checkCurrentSession ? null : (
                  <a
                    href={`/manageLesson/${currentSession}`}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                      <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.133A2 2 0 0 0 16 15.111v-2.33a2.96 2.96 0 0 1-2.263.613L8.455 10.65l.262-.263z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap font-bold">Bài học</span>
                  </a>
                )}
              </>
            )}
            {checkServiceCenter && (
              <div>
                <a
                  href="/manageManager"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm3 13h-6v-2h6v2Zm0-4h-6V7h6v2Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap font-bold">Trung tâm giáo viên</span>
                </a>
              </div>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Menuleft;
