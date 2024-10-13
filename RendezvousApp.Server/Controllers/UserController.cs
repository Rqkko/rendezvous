using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Security;
using RendezvousApp.Server.Entities;

namespace RendezvousApp.Server.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public UserController(IConfiguration configuration, string connectionString)
        {
            _configuration = configuration;
            _connectionString = connectionString;
        }

        [HttpPost("Login")] // contact is email/phoneNumber
        public ActionResult Login([FromBody] LoginCredential loginCredential)
        {
            User? user = null;

            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                connection.Open();

                string query;
                if (loginCredential.Contact.Contains("@"))
                {
                    query = "SELECT * FROM Users WHERE email = @contact";
                }
                else
                {
                    query = "SELECT * FROM Users WHERE phone = @contact";
                }

                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@contact", loginCredential.Contact);

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        user = new User
                        {
                            UserId = (int) reader["userId"],
                            Firstname = (string) reader["firstname"],
                            Lastname = (string) reader["lastname"],
                            Phone = (string) reader["phone"],
                            Email = (string) reader["email"],
                            Password = (string) reader["password"],
                        };
                    }
                }

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }
            }

            // Check if password is correct
            if (user.Password != loginCredential.Password)
            {
                return Unauthorized(new { message = "Incorrect password" });
            }

            // Keep user session
            HttpContext.Session.SetString("FirstName", user.Firstname);
            HttpContext.Session.SetString("LastName", user.Lastname);

            return Ok(user);
        }

        [HttpGet("GetUser")]
        public ActionResult GetUser()
        {
            return Ok(new { firstname = HttpContext.Session.GetString("FirstName"), lastname = HttpContext.Session.GetString("LastName") });
        }
    }
}
