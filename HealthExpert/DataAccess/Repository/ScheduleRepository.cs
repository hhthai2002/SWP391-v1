using BussinessObject.Model.ModelCourse;
using BussinessObject.Model.ModelSession;
using DataAccess.DAO;
using DataAccess.Repository.IRepository;
using System;
using System.Collections.Generic;

namespace DataAccess.Repository
{
    public class ScheduleRepository : IScheduleRepository
    {
        public List<Schedule> GetAllSchedules()
        {
            return ScheduleDAO.GetAllSchedules();
        }

        public Schedule GetScheduleById(int id)
        {
            return ScheduleDAO.GetScheduleById(id);
        }

        public List<Schedule> GetSchedulesByAccountId(Guid accountId)
        {
            return ScheduleDAO.GetSchedulesByAccountId(accountId);
        }

        public void AddSchedule(Schedule schedule)
        {
            ScheduleDAO.AddSchedule(schedule);
        }

        public void UpdateSchedule(Schedule schedule)
        {
            ScheduleDAO.UpdateSchedule(schedule);
        }

        public void DeleteSchedule(int id)
        {
            ScheduleDAO.DeleteSchedule(id);
        }
    }
}
