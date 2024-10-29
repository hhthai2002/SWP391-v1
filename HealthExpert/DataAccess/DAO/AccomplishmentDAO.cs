﻿using BussinessObject.ContextData;
using BussinessObject.Model.ModelUser;

namespace DataAccess.DAO
{
    public class AccomplishmentDAO
    {
        //Get Accomplishment Data
        public static List<Accomplishment> GetAccomplishment()
        {
            var accomplishment = new List<Accomplishment>();
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    accomplishment = ctx.Accomplishments.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return accomplishment;
        }

        //Get Accomplishment Data by Id
        public static Accomplishment GetAccomplishmentById(int acplId)
        {
            var accomplishment = new Accomplishment();
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    accomplishment = ctx.Accomplishments.FirstOrDefault(accomplishment => accomplishment.acplId == acplId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return accomplishment;
        }

        //Add Accomplishment Data
        public static void AddAccomplishment(Accomplishment accomplishment)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    ctx.Accomplishments.Add(accomplishment);
                    ctx.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //Update Accomplishment Data
        public static void UpdateAccomplishment(Accomplishment accomplishment)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    var accomplishmentData = ctx.Accomplishments.FirstOrDefault(accomplishmentData => accomplishmentData.acplId == accomplishment.acplId);
                    if (accomplishmentData != null)
                    {
                        ctx.Entry(accomplishmentData).State =
                            Microsoft.EntityFrameworkCore.EntityState.Modified;
                        ctx.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //Delete Accomplishment Data
        public static void DeleteAccomplishment(Accomplishment accomplishment)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    var accomplishmentData = ctx.Accomplishments.FirstOrDefault(accomplishmentData => accomplishmentData.acplId == accomplishment.acplId);
                    if (accomplishmentData != null)
                    {
                        ctx.Accomplishments.Remove(accomplishmentData);
                        ctx.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
