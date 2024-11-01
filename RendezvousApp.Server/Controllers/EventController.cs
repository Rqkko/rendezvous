using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Globalization; // For CultureInfo (force to use AD year format)

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
                    byte[] locationImageBytes = (byte[])reader["locationImage"];
                    string locationImageBase64 = Convert.ToBase64String(locationImageBytes);

                    locations.Add(new Location
                        {
                            LocationId = (int) reader["locationId"],
                            LocationName = (string) reader["locationName"],
                            LocationDescription = (string) reader["locationDescription"],
                            Area = (int) reader["area"],
                            Capacity = (int) reader["capacity"],
                            Cost = (int) reader["cost"],
                            LocationImage = locationImageBase64,
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

    [HttpGet("GetLocation/{locationId}")]
    public ActionResult GetLocation([FromRoute] int locationId)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            string query = @"
                SELECT L.*, A.* FROM Locations AS L
                JOIN Addresses AS A ON L.locationId=A.locationId
                WHERE L.locationId=@locationId
            ";
            MySqlCommand cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@locationId", locationId);

            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    byte[] locationImageBytes = (byte[])reader["locationImage"];
                    string locationImageBase64 = Convert.ToBase64String(locationImageBytes);

                    Location location = new Location
                    {
                        LocationId = (int)reader["locationId"],
                        LocationName = (string)reader["locationName"],
                        LocationDescription = (string)reader["locationDescription"],
                        Area = (int)reader["area"],
                        Capacity = (int)reader["capacity"],
                        Cost = (int)reader["cost"],
                        LocationImage = locationImageBase64,
                        Province = (string)reader["province"],
                        PostalCode = (string)reader["postalCode"],
                        Additional = (string)reader["additional"],
                        AdminId = (int)reader["adminId"],
                    };

                    return Ok(location);
                }
                else
                {
                    return NotFound(new { message = "Location not found" });
                }
            }
        }
    }

    [HttpGet("GetUserReservations")]
    public ActionResult GetUserReservations()
    {
        int? userId = HttpContext.Session.GetInt32("UserId");
        if (userId == null)
        {
            return Unauthorized(new { message = "User Not Logged in" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            string query = @"
                SELECT L.locationName, L.locationImage, E.eventName, E.theme, E.guestCount, E.date, E.eventDescription FROM Reservations AS R
                JOIN Events AS E ON R.eventId = E.eventId
                JOIN Locations AS L ON E.locationId = L.locationId
                JOIN Addresses AS A ON L.locationId = A.locationId
                WHERE R.userId = @userId
            ";
            MySqlCommand cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@userId", userId);

            List<EventReservationDTO> eventReservations = new();

            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    byte[] locationImageBytes = (byte[])reader["locationImage"];
                    string locationImageBase64 = Convert.ToBase64String(locationImageBytes);

                    eventReservations.Add(new EventReservationDTO
                    {
                        LocationName = (string)reader["locationName"],
                        LocationImage = locationImageBase64,
                        EventName = (string)reader["eventName"],
                        Theme = (string)reader["theme"],
                        GuestCount = (int)reader["guestCount"],
                        Date = DateOnly.FromDateTime((DateTime)reader["date"]),
                        EventDescription = (string)reader["eventDescription"],
                    });
                }
            }

            if (eventReservations.Count == 0)
            {
                return NotFound(new { message = "No Reservation Found" });
            }

            Console.WriteLine(eventReservations.Count + " Reservations Found");
            return Ok(eventReservations);
        }
    }

    // Add Payment, Event, and Reservation to the Database
    [HttpPost("AddReservation")]
    public ActionResult AddReservation([FromBody] ReservationPayloadDTO data)
    {
        int? userId = HttpContext.Session.GetInt32("UserId");
        if (userId == null)
        {
            return Unauthorized(new { message = "User Not Logged in" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    // Insert into Payments table
                    string paymentsQuery = @"
                        INSERT INTO Payments (paymentAmount, paymentDateTime) 
                        VALUES (@paymentAmount, @paymentDateTime);
                        SELECT LAST_INSERT_ID();
                    ";
                    MySqlCommand paymentsCmd = new MySqlCommand(paymentsQuery, connection, transaction);
                    paymentsCmd.Parameters.AddWithValue("@paymentAmount", data.Payment.PaymentAmount);
                    paymentsCmd.Parameters.AddWithValue("@paymentDateTime", data.Payment.PaymentDateTime);
                    var paymentId = Convert.ToInt32(paymentsCmd.ExecuteScalar());

                    // Insert into Events table
                    string eventsQuery = @"
                        INSERT INTO Events (locationId, eventName, eventDescription, date, theme, guestCount)
                        VALUES (@locationId, @eventName, @eventDescription, @date, @theme, @guestCount);
                        SELECT LAST_INSERT_ID();
                    ";
                    MySqlCommand eventsCmd = new MySqlCommand(eventsQuery, connection, transaction);
                    eventsCmd.Parameters.AddWithValue("@locationId", data.LocationId);
                    eventsCmd.Parameters.AddWithValue("@eventName", data.Event.EventName);
                    eventsCmd.Parameters.AddWithValue("@eventDescription", data.Event.EventDescription);
                    eventsCmd.Parameters.AddWithValue("@date", data.Event.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                    eventsCmd.Parameters.AddWithValue("@theme", data.Event.Theme);
                    eventsCmd.Parameters.AddWithValue("@guestCount", data.Event.GuestCount);
                    var eventId = Convert.ToInt32(eventsCmd.ExecuteScalar());

                    // Insert into Reservations table
                    string reservationsQuery = @"
                        INSERT INTO Reservations (userId, eventId, reservationDateTime, paymentId)
                        VALUES (@userId, @eventId, @reservationDateTime, @paymentId)
                    ";
                    MySqlCommand reservationsCmd = new MySqlCommand(reservationsQuery, connection, transaction);
                    reservationsCmd.Parameters.AddWithValue("@userId", userId);
                    reservationsCmd.Parameters.AddWithValue("@eventId", eventId);
                    reservationsCmd.Parameters.AddWithValue("@reservationDateTime", data.Reservation.ReservationDateTime.ToString("yyyy-MM-dd HH:mm:ss.ffffff", CultureInfo.InvariantCulture));
                    reservationsCmd.Parameters.AddWithValue("@paymentId", paymentId);
                    var reservationId = reservationsCmd.ExecuteScalar();

                    // Commit the transaction if all inserts succeed
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // Roll back the transaction if any insert fails
                    try {
                        transaction.Rollback();
                    }
                    catch (Exception ex2)
                    {
                        return StatusCode(500, $"Rollback Failed: {ex2.Message}");
                    }
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        return Ok("Reservation Added");
    }
}