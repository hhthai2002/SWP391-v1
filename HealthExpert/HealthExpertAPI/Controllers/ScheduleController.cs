using BussinessObject.ContextData;
using BussinessObject.Model.ModelCourse;
using HealthExpertAPI.DTO.DTOSchedule;
using HealthExpertAPI.Extension.ExSchedule;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HealthExpertAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly HealthExpertContext _context;

        public ScheduleController(HealthExpertContext context)
        {
            _context = context;
        }

        //add
        [HttpPost("create/{learnerId}")]
        public async Task<IActionResult> CreateSchedule(Guid learnerId, ScheduleDTO scheduleDTO)
        {
            if (_context.Schedules.Any(s => s.ScheduleId == scheduleDTO.Id))
            {
                return BadRequest("Course exists!");
            }

            var newSchedule = new Schedule
            {
                Title = scheduleDTO.Title,
                Description = scheduleDTO.Description,
                GoogleMeetLink = scheduleDTO.GoogleMeetLink,
                ZaloLink = scheduleDTO.ZaloLink,
                TimeStart = scheduleDTO.TimeStart,
                TimeEnd = scheduleDTO.TimeEnd,
                IsOnline = true,
                AccountId = learnerId
            };

            _context.Schedules.Add(newSchedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchedules), new { userId = learnerId }, newSchedule.ToDto());
        }

        //get
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetSchedules(Guid userId)
        {
            var schedules = await _context.Schedules
                .Where(s => s.AccountId == userId)
                .ToListAsync();
            var scheduleDtos = schedules.Select(s => s.ToDto()).ToList();
            return Ok(scheduleDtos);
        }

        //update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] ScheduleUpdateDTO updateDto)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound("Schedule not found.");

            schedule.Title = updateDto.Title;
            schedule.Description = updateDto.Description;
            schedule.GoogleMeetLink = updateDto.GoogleMeetLink;
            schedule.ZaloLink = updateDto.ZaloLink;
            schedule.TimeStart = updateDto.TimeStart;
            schedule.TimeEnd = updateDto.TimeEnd;

            await _context.SaveChangesAsync();
            return Ok(schedule.ToDto());
        }

        //onl or off choosing for learner
        [HttpPut("updateOnlineStatus/{id}")]
        public async Task<IActionResult> UpdateOnlineStatus(int id, [FromBody] bool isOnline)
        {
            // Find the schedule by ID
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound("Schedule not found.");

            schedule.IsOnline = isOnline;

            await _context.SaveChangesAsync();

            return Ok(isOnline);
        }


        //delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound("Schedule not found.");
            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return Ok("Schedule deleted.");
        }
    }
}
