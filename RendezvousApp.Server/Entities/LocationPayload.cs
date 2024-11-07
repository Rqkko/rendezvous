namespace RendezvousApp.Server.Entities;

public class LocationPayload
{
    public string LocationName { get; set; }
    public string LocationDescription { get; set; }
    public int Area { get; set; }
    public int Capacity { get; set; }
    public int Cost { get; set; }
    public string LocationImage { get; set; }
    public string Province { get; set; }
    public string PostalCode { get; set; }
    public string Additional { get; set; }
}