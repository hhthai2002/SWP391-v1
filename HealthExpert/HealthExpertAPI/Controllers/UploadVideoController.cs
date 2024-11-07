using BussinessObject.ContextData;
using BussinessObject.Model.ModelSession;
using HealthExpertAPI.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthExpertAPI.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UploadVideoController : ControllerBase
    {
        private readonly HealthExpertContext _context;

        public UploadVideoController(HealthExpertContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadLesson([FromForm] IFormFile videoFile, [FromForm] string caption, [FromForm] string cover, [FromForm] string sessionId)
        {
            // Tìm session bằng sessionId
            var session = await _context.Sessions.FirstOrDefaultAsync(s => s.sessionId == sessionId);
            if (session == null)
            {
                return NotFound("Session not found.");
            }

            // Đọc dữ liệu video từ IFormFile
            using (var memoryStream = new MemoryStream())
            {
                await videoFile.CopyToAsync(memoryStream);
                var videoData = memoryStream.ToArray();

                // Tạo một đối tượng Lesson mới và liên kết với Session
                var lesson = new Lesson
                {
                    lessonId = Guid.NewGuid().ToString(),
                    videoFile = videoData, // Lưu dữ liệu video dưới dạng byte[]
                    caption = caption,
                    cover = cover,
                    sessionId = sessionId,
                    isActive = true,
                    viewProgress = 0,
                    Session = session
                };

                // Thêm bài học vào cơ sở dữ liệu
                _context.Lessons.Add(lesson);
                await _context.SaveChangesAsync();
            }

            return Ok("Lesson uploaded successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetLessonsBySession(string sessionId)
        {
            var lessons = await _context.Lessons
                .Where(l => l.sessionId == sessionId)
                .ToListAsync();

            if (lessons == null || !lessons.Any())
            {
                return NotFound("No lessons found for this session.");
            }

            return Ok(lessons);
        }
    }
}
