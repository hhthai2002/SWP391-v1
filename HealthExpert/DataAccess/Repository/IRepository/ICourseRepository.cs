﻿using BussinessObject.Model.ModelCourse;

namespace DataAccess.Repository.IRepository
{
    //Create ICourseRepository
    public interface ICourseRepository
    {
        void AddCourse(Course course);
        void DeleteCourse(string courseId);
        List<Course> GetCourses();
        Course GetCourseById(string courseId);
        void UpdateCourse(Course course);
        void AddTeacherByEmail(string email, string courseId);
        void AddEnrollment(Enrollment enrollment);
        void UpdateEnrollment(Enrollment enrollment);
        void DeleteEnrollment(Enrollment enrollment);
        List<Enrollment> GetEnrollments();
        //bool IsTeacher(string email, string courseId);
    }
}
