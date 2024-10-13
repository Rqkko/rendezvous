using Microsoft.AspNetCore.Identity;
using RendezvousApp.Server.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.ConnectionString.json", optional: true, reloadOnChange: true);

// Access configuration
var configuration = builder.Configuration;
string environment = configuration["Environment"];

string connectionString;
string? machineConnectionString = configuration.GetConnectionString("Connection");
Console.WriteLine(machineConnectionString + "MACHINE");
if (machineConnectionString != null) {
    connectionString = machineConnectionString;
    Console.WriteLine("Using machineConnectionString");
}
else
{
    connectionString = configuration.GetConnectionString("DefaultConnection");
}

// Register the connection string in the DI container
builder.Services.AddSingleton(connectionString);

// Configure ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // // Password settings
    // options.Password.RequireDigit = true;
    // options.Password.RequiredLength = 8;
    // options.Password.RequireNonAlphanumeric = false;
    // options.Password.RequireUppercase = true;
    // options.Password.RequireLowercase = true;

    // // Lockout settings
    // options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    // options.Lockout.MaxFailedAccessAttempts = 5;
    // options.Lockout.AllowedForNewUsers = true;

    // // User settings
    // options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
