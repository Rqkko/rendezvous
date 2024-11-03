namespace RendezvousApp.Server.Entities
{
    public class Admin
    {
        public int AdminId { get; set; }
        public int UserId { get; set; }
        public bool IsActive { get; set; }
        public bool canCreate { get; set; }
        public bool canRead { get; set; }
        public bool canUpdate { get; set; }
        public bool canDelete { get; set; }
    }
}