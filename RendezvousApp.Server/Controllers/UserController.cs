using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace RendezvousApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        //private readonly IConfiguration _configuration;

        public UserController(ILogger<UserController> logger/*, IConfiguration configuration*/)
        {
            _logger = logger;
            //_configuration = configuration;
        }

        [HttpGet(Name ="GetUser")]
        public ActionResult Get()
        {
            return Ok("UserController is working");
        }

        //[HttpGet(Name = "GetUserController")]
        //public IEnumerable<WeatherForecast>? Get()
        //{
        //    return null;
        //    return enumerable.range(1, 5).select(index => new weatherforecast
        //    {
        //        date = dateonly.fromdatetime(datetime.now.adddays(index)),
        //        temperaturec = random.shared.next(-20, 55),
        //        summary = summaries[random.shared.next(summaries.length)]
        //    })
        //    .toarray();
        //}
    }
}

//optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));