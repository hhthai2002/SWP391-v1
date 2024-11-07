using BussinessObject.ContextData;
using BussinessObject.Model.ModelCourse;
using BussinessObject.Model.ModelUser;

namespace DataAccess.DAO
{
    //CourseDAO
    public class CourseDAO
    {
        public static void AddCourse(Course course)
        {
            using (var context = new HealthExpertContext())
            {
                context.Courses.Add(course);
                context.SaveChanges();
            }
        }

        public static void DeleteCourse(string courseId)
        {
            using (var context = new HealthExpertContext())
            {
                var course = context.Courses.Find(courseId);
                context.Courses.Remove(course);
                context.SaveChanges();
            }
        }

        public static List<Course> GetCourses()
        {
            using (var context = new HealthExpertContext())
            {
                return context.Courses.ToList();
            }
        }

        public static Course GetCourseById(string courseId)
        {
            using (var context = new HealthExpertContext())
            {
                return context.Courses.Find(courseId);
            }
        }

        public static void UpdateCourse(Course course)
        {
            using (var context = new HealthExpertContext())
            {
                context.Courses.Update(course);
                context.SaveChanges();
            }
        }

        //Add teacher
        public static void AddCourseManagerByEmail(string email, string courseId)
        {
            using (var context = new HealthExpertContext())
            {
                var user = context.Accounts.FirstOrDefault(x => x.email == email);
                if (user != null)
                {
                    var roleId = 3; // Đặt roleId cho Course Manager
                    var teacher = context.Teachers.FirstOrDefault(t => t.Accounts.Any(a => a.email == email));

                    // Nếu teacher chưa tồn tại, tạo mới và thêm vào context
                    if (teacher == null)
                    {
                        teacher = new Teacher
                        {
                            Accounts = new List<Account> { user }
                        };
                        context.Teachers.Add(teacher);
                        user.roleId = roleId;
                    }

                    // Kiểm tra xem Teacher đã được gán vào Course này chưa
                    var existingMapping = context.CourseTeacherMappings
                        .FirstOrDefault(m => m.courseId == courseId && m.teacherId == teacher.teacherId);

                    // Nếu mapping chưa tồn tại, thêm mới vào context
                    if (existingMapping == null)
                    {
                        var mapping = new Course_Teacher_Mapping
                        {
                            courseId = courseId,
                            teacherId = teacher.teacherId
                        };
                        context.CourseTeacherMappings.Add(mapping);
                    }

                    context.SaveChanges();
                }
                else
                {
                    throw new Exception("Không tìm thấy tài khoản với email " + email);
                }
            }
        }



        //private static int GenerateUniqueCourseManagerId()
        //{
        //    using (var context = new HealthExpertContext())
        //    {
        //        int existingCount = context.Teachers.Count();
        //        return existingCount + 1;
        //    }
        //}

        public static void AddEnrollment(Enrollment enrollment)
        {
            using (var context = new HealthExpertContext())
            {
                context.Enrollments.Add(enrollment);
                context.SaveChanges();
            }
        }

        //Get List of Enrollments
        public static List<Enrollment> GetEnrollments()
        {
            using (var context = new HealthExpertContext())
            {
                return context.Enrollments.ToList();
            }
        }

        //Update Enrollment
        public static void UpdateEnrollment(Enrollment enrollment)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    ctx.Enrollments.Add(enrollment);
                    ctx.Entry(enrollment).State =
                        Microsoft.EntityFrameworkCore.EntityState.Modified;
                    ctx.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //Delete Enrollment
        public static void DeleteEnrollment(Enrollment enrollment)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    ctx.Enrollments.Remove(enrollment);
                    ctx.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //Check if user already a course manager with email and courseId
        //public static bool IsTeacher(string email, string courseId)
        //{
        //    using (var context = new HealthExpertContext())
        //    {
        //        var teacher = context.Teachers.FirstOrDefault(
        //                               cm => cm.Accounts.Any(a => a.email.Equals(email) && cm.courseId.Equals(courseId)));
        //        return teacher != null;
        //    }
        //}
    }
}