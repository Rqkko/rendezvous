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
        return Ok("Working");
    }
}