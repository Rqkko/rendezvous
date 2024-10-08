var builder = WebApplication.CreateBuilder(args);

// Access configuration
var configuration = builder.Configuration;
string environment = configuration["Environment"];
string connectionString = environment == "Windows"
    ? configuration.GetConnectionString("WindowsConnection")
    : configuration.GetConnectionString("DefaultConnection");

// Register the connection string in the DI container
builder.Services.AddSingleton(connectionString);

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
