using BussinessObject.Model.ModelCourse;
using HealthExpertAPI.DTO.DTOSchedule;

namespace HealthExpertAPI.Extension.ExSchedule
{
    public static class ScheduleExtensions
    {
        public static ScheduleDTO ToDto(this Schedule schedule)
        {
            if (schedule == null)
                return null;

            return new ScheduleDTO
            {
                Id = schedule.ScheduleId,
                Title = schedule.Title,
                Description = schedule.Description,
                GoogleMeetLink = schedule.GoogleMeetLink,
                ZaloLink = schedule.ZaloLink,
                TimeStart = schedule.TimeStart,
                TimeEnd = schedule.TimeEnd,
                IsOnline = schedule.IsOnline,
            };
        }

        public static Schedule ToEntity(this ScheduleUpdateDTO updateDto, Guid accountId)
        {
            if (updateDto == null)
                return null;

            return new Schedule
            {
                Title = updateDto.Title,
                Description = updateDto.Description,
                GoogleMeetLink = updateDto.GoogleMeetLink,
                ZaloLink = updateDto.ZaloLink,
                TimeStart = updateDto.TimeStart,
                TimeEnd = updateDto.TimeEnd,
                AccountId = accountId
            };
        }
    }
}
