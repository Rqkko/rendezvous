using Microsoft.AspNetCore.Identity;

namespace RendezvousApp.Server.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public int UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}