namespace AlphaAuthentication.Entity
{
    public class Authentication
    {
        public long Id { get; set; }
        public int BPOId { get; set; }
        public long LeadId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string MobileNumber { get; set; }
        public string EmailAddress { get; set; }
        public string SourceUrl { get; set; }
        public DateTime CreatedOn { get; set; }
        public string IP { get; set; }
    }
}
