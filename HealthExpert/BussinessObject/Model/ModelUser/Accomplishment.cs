﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BussinessObject.Model.ModelUser
{
    public class Accomplishment
    {
        [Key]
        public int acplId { get; set; }
        public string acpltName { get; set; }
        public string acplDescription { get; set; }
        public DateTime receptDate { get; set; } = DateTime.Now;
        public bool isActive { get; set; }
        public Guid accountId { get; set; }
        [JsonIgnore]
        public virtual Account? Account { get; set; }
    }
}
