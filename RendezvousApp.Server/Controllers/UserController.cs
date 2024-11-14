using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Security;

using RendezvousApp.Server.Entities;

namespace RendezvousApp.Server.Controllers;
[ApiController]
[Route("Api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;
    private readonly string? _encryptionKey;

    public UserController(IConfiguration configuration, string connectionString)
    {
        _configuration = configuration;
        _connectionString = connectionString;
        _encryptionKey = _configuration["EncryptionKey"];
    }

    [HttpPost("Login")] // contact is email/phoneNumber
    public ActionResult Login([FromBody] LoginCredential loginCredential)
    {
        User? user = null;
        
        if (_encryptionKey == null)
        {
            return StatusCode(500, new { message = "Encryption key not found" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            string query;
            if (loginCredential.Contact.Contains("@"))
            {
                query = "SELECT userId, firstname, lastname, phone, email, AES_DECRYPT(password, @encryptionKey) AS decryptedPassword FROM Users WHERE email = @contact";
            }
            else
            {
                query = "SELECT userId, firstname, lastname, phone, email, CAST(AES_DECRYPT(password, @encryptionKey) AS char) AS decryptedPassword FROM Users WHERE phone = @contact";
            }

            MySqlCommand cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@contact", loginCredential.Contact);
            cmd.Parameters.AddWithValue("@encryptionKey", _encryptionKey);

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
                        Password = (string) reader["decryptedPassword"],
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

        // User Session Data
        HttpContext.Session.SetInt32("UserId", user.UserId);
        HttpContext.Session.SetString("FirstName", user.Firstname);
        HttpContext.Session.SetString("LastName", user.Lastname);
        HttpContext.Session.SetString("Phone", user.Phone);
        HttpContext.Session.SetString("Email", user.Email);

        // Check for Admin Access
        Admin? admin = null;

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            string query = "SELECT * FROM Admins WHERE userId = @userId";
            MySqlCommand cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@userId", user.UserId);

            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    admin = new Admin
                    {
                        AdminId = (int) reader["adminId"],
                        UserId = (int) reader["userId"],
                        IsActive = (bool) reader["isActive"],
                        canCreate = (bool) reader["canCreate"],
                        canRead = (bool) reader["canRead"],
                        canUpdate = (bool) reader["canUpdate"],
                        canDelete = (bool) reader["canDelete"],
                    };
                }
            }
        }

        // Admin Session Data

        if (admin != null)
        {
            HttpContext.Session.SetInt32("AdminId", admin.AdminId);
            HttpContext.Session.SetInt32("UserId", admin.UserId);
            HttpContext.Session.SetString("IsActive", admin.IsActive.ToString());
            HttpContext.Session.SetString("CanCreate", admin.canCreate.ToString());
            HttpContext.Session.SetString("CanRead", admin.canRead.ToString());
            HttpContext.Session.SetString("CanUpdate", admin.canUpdate.ToString());
            HttpContext.Session.SetString("CanDelete", admin.canDelete.ToString());
        } else
        {
            HttpContext.Session.SetString("IsActive", false.ToString());
        }
        
        var payload = new
        {
            User = user,
            IsActive = HttpContext.Session.GetString("IsActive")
        };

        return Ok(payload);
    }

    [HttpPost("Register")]
    public ActionResult Register([FromBody] User user)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            MySqlCommand cmd = new MySqlCommand("AddUser", connection);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@c_firstname", user.Firstname);
            cmd.Parameters.AddWithValue("@c_lastname", user.Lastname);
            cmd.Parameters.AddWithValue("@c_phone", user.Phone);
            cmd.Parameters.AddWithValue("@c_email", user.Email);
            cmd.Parameters.AddWithValue("@c_password", user.Password);
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (MySqlException ex)
            {
                if (ex.Message.Contains("Duplicate"))
                {
                    return Conflict(new { message = "User already exists" });
                }
            }
        }

        return Ok(new { message = "User registered" });
    }

    [HttpGet("GetUser")]
    public ActionResult GetUser()
    {
        if (HttpContext.Session.GetInt32("UserId") == null)
        {
            return Unauthorized(new { message = "User not logged in" });
        }
        
        return Ok(new {
            userId = HttpContext.Session.GetInt32("UserId"),
            firstname = HttpContext.Session.GetString("FirstName"),
            lastname = HttpContext.Session.GetString("LastName"),
            phone = HttpContext.Session.GetString("Phone"),
            email = HttpContext.Session.GetString("Email")
        });
    }

    [HttpPost("Logout")]
    public ActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Logged out" });
    }

    [HttpGet("CheckAdmin")]
    public ActionResult CheckAdmin()
    {
        if (HttpContext.Session.GetString("IsActive") == false.ToString() || HttpContext.Session.GetInt32("AdminId") == null)
        {
            return Unauthorized(new { message = "User is not an admin" });
        }

        return Ok();
    }

    [HttpGet("CheckPermission")]
    public ActionResult CheckPermission([FromQuery] string permission)
    {
        if (permission != "create" && permission != "read" && permission != "update" && permission != "delete")
        {
            return BadRequest(new { message = "Invalid permission" });
        }

        if (HttpContext.Session.GetString($"Can{permission.First().ToString().ToUpper() + permission.Substring(1)}") == false.ToString()) // Check with Session Data
        {
            return Unauthorized(new { message = "User does not have permission" });
        }

        return Ok();
    }
}
