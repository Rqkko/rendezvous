namespace RendezvousApp.Server.Entities;

public class Payment
{
    public int PaymentId { get; set; }
    public int PaymentAmount { get; set; }
    public DateTime PaymentDateTime { get; set; }
}