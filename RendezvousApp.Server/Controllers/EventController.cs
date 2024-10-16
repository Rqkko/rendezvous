using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

using RendezvousApp.Server.Entities;

namespace RendezvousApp.Server.Controllers;
[ApiController]
[Route("Api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public EventController(IConfiguration configuration, string connectionString)
    {
        _configuration = configuration;
        _connectionString = connectionString;
    }

    [HttpGet("GetAllLocations")]
    public ActionResult GetAllLocations()
    {
        List<Location> locations = new();

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            string query = @"
                SELECT L.*, A.* FROM Locations AS L
                JOIN Addresses AS A ON L.locationId = A.locationId;
            ";
            MySqlCommand cmd = new MySqlCommand(query, connection);

            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    locations.Add(new Location
                        {
                            LocationId = (int) reader["locationId"],
                            LocationName = (string) reader["locationName"],
                            LocationDescription = (string) reader["locationDescription"],
                            Area = (int) reader["area"],
                            Capacity = (int) reader["capacity"],
                            Cost = (int) reader["cost"],
                            LocationImage = (byte[]) reader["locationImage"],
                            Province = (string) reader["province"],
                            PostalCode = (string) reader["postalCode"],
                            Additional = (string) reader["additional"],
                            AdminId = (int) reader["adminId"],
                        }
                    );
                }
            }

            if (locations.Count == 0)
            {
                return NotFound(new { message = "No Location Found" });
            }

            Console.WriteLine(locations.Count + " Locations Found");
            return Ok(locations);
        }
    }

    // For Admin
    [HttpGet("GetAllReservations")]
    public ActionResult GetAllReservations()
    {
        return Ok();
    }

    [HttpGet("GetUserReservations")]
    public ActionResult GetUserReservations()
    {
        return Ok();
    }
}