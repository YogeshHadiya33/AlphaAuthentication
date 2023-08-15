namespace AlphaAuthentication.Models
{
    public class AuthenticationModel : ResponseModel
    {
        public long Id { get; set; }
        public int BPOId { get; set; }
        public long LeadId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string MobileNumber { get; set; }
        public string EmailAddress { get; set; }
        public string SourceUrl { get; set; }
    }
     
}
