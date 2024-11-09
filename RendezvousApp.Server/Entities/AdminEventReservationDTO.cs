namespace RendezvousApp.Server.Entities
{
    // For returning to frontend
    public class AdminEventReservationDTO
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string LocationName { get; set; }
        public string LocationImage { get; set; }
        public string Province { get; set; }
        public string EventName { get; set; }
        public string Theme { get; set; }
        public int GuestCount { get; set; }
        public DateOnly Date { get; set; }
    }
}