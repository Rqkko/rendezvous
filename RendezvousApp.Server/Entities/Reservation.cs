namespace RendezvousApp.Server.Entities;

public class Reservation
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
    public DateTime ReservationDateTime { get; set; }
    public int PaymentId { get; set; }
}
