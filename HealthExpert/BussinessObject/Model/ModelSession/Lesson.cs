using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BussinessObject.Model.ModelSession
{
    public class Lesson
    {
        [Key]
        public string lessonId { get; set; }

        [Required]
        public byte[] videoFile { get; set; } // Lưu trữ dữ liệu video nhị phân

        [Required]
        public string caption { get; set; }

        [Required]
        public string cover { get; set; }

        [Required]
        public string sessionId { get; set; }

        [Required]
        public bool isActive { get; set; }

        public decimal viewProgress { get; set; }

        // Navigation property đến Session
        [JsonIgnore]
        public virtual Session? Session { get; set; }
    }

}
