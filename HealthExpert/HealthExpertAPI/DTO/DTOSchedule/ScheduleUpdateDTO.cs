namespace HealthExpertAPI.DTO.DTOSchedule
{
    public class ScheduleUpdateDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string GoogleMeetLink { get; set; }
        public string ZaloLink { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
    }
}
