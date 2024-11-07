using BussinessObject.Model.ModelUser;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessObject.Model.ModelCourse
{
    public class Schedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScheduleId { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }
        public string? GoogleMeetLink { get; set; }
        public string? ZaloLink { get; set; }

        [Required]
        public DateTime TimeStart { get; set; }

        [Required]
        public DateTime TimeEnd { get; set; }
        [Required]
        public bool IsOnline { get; set; }

        // Reference to the user who created or attends the schedule
        [ForeignKey("Account")]
        public Guid AccountId { get; set; }
        public virtual Account Account { get; set; }
    }
}
