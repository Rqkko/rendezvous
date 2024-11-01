namespace RendezvousApp.Server.Entities
{
    // For returning to frontend
    public class EventReservationDTO
    {
    // TODO
        public string LocationName { get; set; }
        public string LocationImage { get; set; }
        public string EventName { get; set; }
        public string Theme { get; set; }
        public int GuestCount { get; set; }
        public DateOnly Date { get; set; }
        public string EventDescription { get; set; }
    }
}