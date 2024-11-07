using BussinessObject.ContextData;
using BussinessObject.Model.ModelCourse;
using BussinessObject.Model.ModelSession;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.DAO
{
    public class ScheduleDAO
    {
        //get schedule list
        public static List<Schedule> GetAllSchedules()
        {
            using var db = new HealthExpertContext();
            return db.Schedules.ToList();
        }

        //get schedule by id
        public static Schedule GetScheduleById(int id)
        {
            using var db = new HealthExpertContext();
            return db.Schedules.FirstOrDefault(schedule => schedule.ScheduleId == id);
        }

        //get schedule by AccountId
        public static List<Schedule> GetSchedulesByAccountId(Guid accountId)
        {
            using var db = new HealthExpertContext();
            return db.Schedules.Where(schedule => schedule.AccountId == accountId).ToList();
        }

        //add
        public static void AddSchedule(Schedule schedule)
        {
            using var db = new HealthExpertContext();
            db.Schedules.Add(schedule);
            db.SaveChanges();
        }

        //update
        public static void UpdateSchedule(Schedule schedule)
        {
            using var db = new HealthExpertContext();
            db.Schedules.Update(schedule);
            db.SaveChanges();
        }

        //del
        public static void DeleteSchedule(int id)
        {
            using var db = new HealthExpertContext();
            var schedule = GetScheduleById(id);
            if (schedule != null)
            {
                db.Schedules.Remove(schedule);
                db.SaveChanges();
            }
        }
    }
}
