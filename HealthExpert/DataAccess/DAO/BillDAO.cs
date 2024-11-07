﻿using BussinessObject.ContextData;
using BussinessObject.Model.ModelPayment;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DAO
{
    public class BillDAO
    {
        //Get payment by id
        public static Bill GetBillById(Guid id)
        {
            var bill = new Bill();
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    bill = ctx.Bills.FirstOrDefault(bill => bill.billId == id);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return bill;
        }

        //Get all bill
        public static List<Bill> GetBills()
        {
            var listPayment = new List<Bill>();
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    listPayment = ctx.Bills.ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return listPayment;
        }

        //Insert payment
        public static void InsertBill(Bill bill)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    ctx.Bills.Add(bill);
                    ctx.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Update payment
        public static void UpdateBill(Guid id, Bill bill)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    if (GetBillById(id) != null)
                    {
                        ctx.Bills.Add(bill);
                        ctx.Entry(bill).State = EntityState.Modified;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Delete payment
        public static void DeleteBill(Guid id)
        {
            try
            {
                using (var ctx = new HealthExpertContext())
                {
                    var payment = ctx.Bills.FirstOrDefault(payment => payment.billId == id);
                    ctx.Bills.Remove(payment);
                    ctx.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
