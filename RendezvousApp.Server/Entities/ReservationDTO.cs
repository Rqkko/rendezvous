namespace RendezvousApp.Server.Entities;

public class ReservationDTO
{
    public int LocationId { get; set; }
    public Event Event { get; set; }
    public Reservation Reservation { get; set; }
    public Payment Payment { get; set; }
}