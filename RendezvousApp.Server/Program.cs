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

Console.WriteLine("Using ConnectionString: " + connectionString);

// Register the connection string in the DI container
builder.Services.AddSingleton(connectionString);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Session Services
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
    options.Cookie.HttpOnly = true; // Make the session cookie HttpOnly
    options.Cookie.IsEssential = true; // Make the session cookie essential
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSession();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
