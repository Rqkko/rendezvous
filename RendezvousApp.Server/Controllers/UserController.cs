using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Security;

namespace RendezvousApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetUser")]
        public ActionResult Get()
        {
            return Ok("UserController is working (" + _configuration.GetConnectionString("DefaultConnection") + ")");
        }

        [HttpGet("GetFirstname")]
        public ActionResult GetFirstname()
        {
            string? firstname = null;

            MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            connection.Open();


            MySqlCommand cmd = new MySqlCommand(
                "SELECT firstname FROM users WHERE userId=0",
                connection
            );

            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    firstname = reader.GetString(0);
                }
            }

            connection.Close();
            return Ok(firstname);
        }
    }
}
