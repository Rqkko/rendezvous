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
        private readonly string _connectionString;

        public UserController(IConfiguration configuration, string connectionString)
        {
            _configuration = configuration;
            _connectionString = connectionString;
        }

        [HttpGet("GetUser/{contact}/{password}")] // contact is email/phoneNumber
        public ActionResult GetUser(string contact, string password)
        {
            return Ok(contact + "_" + password);
        }

        [HttpGet("GetFirstname")]
        public ActionResult GetFirstname()
        {
            string? firstname = null;

            // MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            MySqlConnection connection = new MySqlConnection(_connectionString);
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
