namespace RendezvousApp.Server.Entities
{
    public class Location
    {
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public string LocationDescription { get; set; }
        public int Area { get; set; }
        public int Capacity { get; set; }
        public int Cost { get; set; }
        public byte[] LocationImage { get; set; }
        public string Province { get; set; }
        public string PostalCode { get; set; }
        public string Additional { get; set; }
        public int AdminId { get; set; }
    }
}
