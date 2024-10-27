namespace RendezvousApp.Server.Entities;

public class ReservationDTO
{
    public Event Event { get; set; }
    public Reservation Reservation { get; set; }
    public Payment Payment { get; set; }
}