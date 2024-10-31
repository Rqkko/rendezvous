namespace RendezvousApp.Server.Entities;

public class ReservationPayloadDTO
{
    public int LocationId { get; set; }
    public EventDTO Event { get; set; }
    public ReservationDTO Reservation { get; set; }
    public PaymentDTO Payment { get; set; }
}

public class EventDTO
{
    public string EventName { get; set; }
    public string EventDescription { get; set; }
    public DateOnly Date { get; set; }
    public string Theme { get; set; }
    public int GuestCount { get; set; }
}

public class ReservationDTO
{
    public DateTime ReservationDateTime { get; set; }
}

public class PaymentDTO
{
    public int PaymentAmount { get; set; }
    public DateTime PaymentDateTime { get; set; }
}