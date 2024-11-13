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
                SELECT L.locationName, L.locationImage, A.province, E.eventName, E.theme, E.guestCount, E.date, E.eventDescription FROM Reservations AS R
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
                        Province = (string)reader["province"],
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

        try{
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                connection.Open();

                MySqlCommand cmd = new MySqlCommand("ReserveEvent", connection);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@p_locationId", data.LocationId);
                cmd.Parameters.AddWithValue("@p_eventName", data.Event.EventName);
                cmd.Parameters.AddWithValue("@p_eventDescription", data.Event.EventDescription);
                cmd.Parameters.AddWithValue("@p_eventDate", data.Event.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                cmd.Parameters.AddWithValue("@p_theme", data.Event.Theme);
                cmd.Parameters.AddWithValue("@p_guestCount", data.Event.GuestCount);
                cmd.Parameters.AddWithValue("@p_reservationDateTime", data.Reservation.ReservationDateTime.ToString("yyyy-MM-dd HH:mm:ss.ffffff", CultureInfo.InvariantCulture));
                cmd.Parameters.AddWithValue("@p_paymentAmount", data.Payment.PaymentAmount);
                cmd.Parameters.AddWithValue("@p_paymentDateTime", data.Payment.PaymentDateTime);
                cmd.Parameters.AddWithValue("@p_userId", userId);

                cmd.ExecuteNonQuery();
            }
        }
        catch (MySqlException ex)
        {
            if (ex.Number == 45000 || ex.Message.Contains("Location is already reserved")) // Custom error codes start at 50000 in SQL Server
            {
                return BadRequest(new { message = ex.Message});
            }
            else
            {
                // Handle other SQL errors here
                return StatusCode(500, new { message = "An error occurred while processing the reservation. " + ex.Message });
            }
        }

        return Ok("Reservation Added");
    }

    // For Admin
    [HttpPost("AddLocation")]
    public ActionResult AddLocation([FromBody] LocationPayload data)
    {
        int? adminId = HttpContext.Session.GetInt32("AdminId");
        string? isActive = HttpContext.Session.GetString("IsActive");
        if (adminId == null || isActive == false.ToString() || isActive == null)
        {
            return Unauthorized(new { message = "Not Admin" });
        }

        // Check for permission
        string? canCreate = HttpContext.Session.GetString("CanCreate");
        if (canCreate == false.ToString() || canCreate == null)
        {
            return Unauthorized(new { message = "No Permission" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    // Insert into Locations table
                    string locationQuery = @"
                        INSERT INTO Locations (locationName, locationDescription, area, capacity, cost, locationImage, adminId) 
                        VALUES (@locationName, @locationDescription, @area, @capacity, @cost, @locationImage, @adminId);
                        SELECT LAST_INSERT_ID();
                    ";
                    MySqlCommand locationCmd = new MySqlCommand(locationQuery, connection, transaction);
                    locationCmd.Parameters.AddWithValue("@locationName", data.LocationName);
                    locationCmd.Parameters.AddWithValue("@locationDescription", data.LocationDescription);
                    locationCmd.Parameters.AddWithValue("@area", data.Area);
                    locationCmd.Parameters.AddWithValue("@capacity", data.Capacity);
                    locationCmd.Parameters.AddWithValue("@cost", data.Cost);
                    locationCmd.Parameters.AddWithValue("@locationImage", Convert.FromBase64String(data.LocationImage));
                    locationCmd.Parameters.AddWithValue("@adminId", adminId);

                    var locationId = Convert.ToInt32(locationCmd.ExecuteScalar());

                    // Insert into Events table
                    string addressQuery = @"
                        INSERT INTO Addresses (locationId, province, postalCode, additional)
                        VALUES (@locationId, @province, @postalCode, @additional);
                        SELECT LAST_INSERT_ID();
                    ";
                    MySqlCommand addressCmd = new MySqlCommand(addressQuery, connection, transaction);
                    addressCmd.Parameters.AddWithValue("@locationId", locationId);
                    addressCmd.Parameters.AddWithValue("@province", data.Province);
                    addressCmd.Parameters.AddWithValue("@postalCode", data.PostalCode);
                    addressCmd.Parameters.AddWithValue("@additional", data.Additional);

                    var addressId = Convert.ToInt32(addressCmd.ExecuteScalar());

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
                        return StatusCode(500, new { message = $"Rollback Failed: {ex2.Message}" });
                    }
                    return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
                }
            }
        }

        return Ok("Location Added");
    }

    [HttpDelete("DeleteLocation/{locationId}")]
    public ActionResult DeleteLocation([FromRoute] int locationId)
    {
        string? isActive = HttpContext.Session.GetString("IsActive");
        if (isActive == false.ToString() || isActive == null)
        {
            return Unauthorized(new { message = "Not Admin" });
        }

        // Check for permission
        string? canDelete = HttpContext.Session.GetString("CanDelete");
        if (canDelete == false.ToString() || canDelete == null)
        {
            return Unauthorized(new { message = "No Permission" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            try
            {
                // Delete from Locations table (Address will cascade delete)
                string locationQuery = @"
                    DELETE FROM Locations WHERE locationId=@locationId;
                ";
                MySqlCommand locationCmd = new MySqlCommand(locationQuery, connection);
                locationCmd.Parameters.AddWithValue("@locationId", locationId);
                locationCmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        return Ok("Location Deleted");
    }

    [HttpPut("UpdateLocation/{locationId}")]
    public ActionResult UpdateLocation([FromRoute] int locationId, [FromBody] LocationPayload data)
    {
        string? isActive = HttpContext.Session.GetString("IsActive");
        if (isActive == false.ToString() || isActive == null)
        {
            return Unauthorized(new { message = "Not Admin" });
        }

        // Check for permission
        string? canUpdate = HttpContext.Session.GetString("CanUpdate");
        if (canUpdate == false.ToString() || canUpdate == null)
        {
            return Unauthorized(new { message = "No Permission" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    // Update Locations table
                    string locationQuery = @"
                        UPDATE Locations
                        SET locationName=@locationName, locationDescription=@locationDescription, area=@area, capacity=@capacity, cost=@cost, locationImage=@locationImage
                        WHERE locationId=@locationId;
                    ";
                    MySqlCommand locationCmd = new MySqlCommand(locationQuery, connection, transaction);
                    locationCmd.Parameters.AddWithValue("@locationName", data.LocationName);
                    locationCmd.Parameters.AddWithValue("@locationDescription", data.LocationDescription);
                    locationCmd.Parameters.AddWithValue("@area", data.Area);
                    locationCmd.Parameters.AddWithValue("@capacity", data.Capacity);
                    locationCmd.Parameters.AddWithValue("@cost", data.Cost);
                    locationCmd.Parameters.AddWithValue("@locationImage", Convert.FromBase64String(data.LocationImage));
                    locationCmd.Parameters.AddWithValue("@locationId", locationId);
                    locationCmd.ExecuteNonQuery();

                    // Update Addresses table
                    string addressQuery = @"
                        UPDATE Addresses
                        SET province=@province, postalCode=@postalCode, additional=@additional
                        WHERE locationId=@locationId;
                    ";
                    MySqlCommand addressCmd = new MySqlCommand(addressQuery, connection, transaction);
                    addressCmd.Parameters.AddWithValue("@province", data.Province);
                    addressCmd.Parameters.AddWithValue("@postalCode", data.PostalCode);
                    addressCmd.Parameters.AddWithValue("@additional", data.Additional);
                    addressCmd.Parameters.AddWithValue("@locationId", locationId);
                    addressCmd.ExecuteNonQuery();

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    try
                    {
                        transaction.Rollback();
                    }
                    catch (Exception ex2)
                    {
                        return StatusCode(500, new { message = $"Rollback Failed: {ex2.Message}" });
                    }
                    return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
                }
            }
        }

            return Ok("Location Updated");
    }

    [HttpGet("GetAllReservations")]
    public ActionResult GetAllReservations()
    {
        string? isActive = HttpContext.Session.GetString("IsActive");
        if (isActive == false.ToString() || isActive == null)
        {
            return Unauthorized(new { message = "Not Admin" });
        }

        string? canRead = HttpContext.Session.GetString("CanRead");
        if (canRead == false.ToString() || canRead == null)
        {
            return Unauthorized(new { message = "No Permission" });
        }

        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            connection.Open();

            string query = @"
                SELECT U.firstname, U.lastname, L.locationName, L.locationImage, A.province, E.eventName, E.theme, E.guestCount, E.date
                FROM Reservations AS R
                JOIN Users AS U ON R.userId = U.userId
                JOIN Events AS E ON R.eventId = E.eventId
                JOIN Locations AS L ON E.locationId = L.locationId
                JOIN Addresses AS A ON L.locationId = A.locationId;
            ";
            MySqlCommand cmd = new MySqlCommand(query, connection);

            List<AdminEventReservationDTO> adminEventReservations = new();

            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    byte[] locationImageBytes = (byte[])reader["locationImage"];
                    string locationImageBase64 = Convert.ToBase64String(locationImageBytes);

                    adminEventReservations.Add(new AdminEventReservationDTO
                    {
                        Firstname = (string)reader["firstname"],
                        Lastname = (string)reader["lastname"],
                        LocationName = (string)reader["locationName"],
                        LocationImage = locationImageBase64,
                        Province = (string)reader["province"],
                        EventName = (string)reader["eventName"],
                        Theme = (string)reader["theme"],
                        GuestCount = (int)reader["guestCount"],
                        Date = DateOnly.FromDateTime((DateTime)reader["date"]),
                    });
                }
            }

            if (adminEventReservations.Count == 0)
            {
                return NotFound(new { message = "No Reservation Found" });
            }

            Console.WriteLine(adminEventReservations.Count + " Reservations Found");
            return Ok(adminEventReservations);
        }
    }
}