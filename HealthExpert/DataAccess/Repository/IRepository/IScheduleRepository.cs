using BussinessObject.Model.ModelCourse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repository.IRepository
{
    public interface IScheduleRepository
    {
        List<Schedule> GetAllSchedules();
        Schedule GetScheduleById(int id);
        List<Schedule> GetSchedulesByAccountId(Guid accountId);
        void AddSchedule(Schedule schedule);
        void UpdateSchedule(Schedule schedule);
        void DeleteSchedule(int id);
    }
}
