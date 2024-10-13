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
        private readonly ApplicationDbContext _context;

        public UserController(IConfiguration configuration, string connectionString, ApplicationDbContext context)
        {
            _configuration = configuration;
            _connectionString = connectionString;
            _context = context;
        }

        [HttpGet("GetUser/{contact}/{password}")] // contact is email/phoneNumber
        public async ActionResult GetUser(string contact, string password)
        {
            User? user = null;

            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                connection.Open();

                string query;
                if (contact.Contains("@"))
                {
                    query = "SELECT * FROM Users WHERE email = @contact";
                }
                else
                {
                    query = "SELECT * FROM Users WHERE phone = @contact";
                }

                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@contact", contact);

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
            if (user.Password != password)
            {
                return Unauthorized(new { message = "Incorrect password" });
            }

            // Assign user information to ApplicationUser
            var applicationUser = new ApplicationUser
            {
                UserId = user.UserId,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Phone = user.Phone,
                Email = user.Email,
            };

            // Save ApplicationUser to ApplicationDbContext
            _context.Users.Add(applicationUser);
            await _context.SaveChangesAsync();

            Console.WriteLine("User's Firstname: " + _context.Users.Find(0).Firstname);
            return Ok(applicationUser);
        }

        [HttpGet("GetFirstname")]
        public ActionResult GetFirstname()
        {
            return Ok(_context.Users.Find(0).Firstname);
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
