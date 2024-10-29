using BussinessObject.Model.ModelUser;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BussinessObject.Model.ModelCourse
{
    public class Teacher
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int teacherId { get; set; }
        //public string courseId { get; set; }
        [JsonIgnore]
        public ICollection<Account>? Accounts { get; set; }

        public virtual ICollection<Course_Teacher_Mapping> CourseTeachers { get; set; } = new List<Course_Teacher_Mapping>();
    }
}
