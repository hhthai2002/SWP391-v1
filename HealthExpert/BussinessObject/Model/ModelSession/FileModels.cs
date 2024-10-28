using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BussinessObject.Model.ModelSession
{
    public record FileModels
 (
     [FromForm(Name = "file")] IFormFile VideoFile
 );

}
