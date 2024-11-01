﻿using System.ComponentModel.DataAnnotations;

namespace HealthExpertAPI.DTO.DTOLesson
{
    public class LessonDTO
    {
        public string lessonId { get; set; }
        [Required] public byte[] videoFile { get; set; }
        [Required] public string caption { get; set; } = string.Empty;//Lesson Name
        public string cover { get; set; }
        [Required] public string sessionId { get; set; }
        [Required] public bool isActive { get; set; }
    }
}
