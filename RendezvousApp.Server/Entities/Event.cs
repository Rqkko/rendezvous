namespace RendezvousApp.Server.Entities;

public class Event
{
    public int EventId { get; set; }
    public int LocationId { get; set; }
    public string EventName { get; set; }
    public string EventDescription { get; set; }
    public DateOnly Date { get; set; }
    public string Theme { get; set; }
    public int GuestCount { get; set; }
}