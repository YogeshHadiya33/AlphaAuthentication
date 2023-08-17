namespace AlphaAuthentication.Entity
{
    public class AuditLog
    {
        public int Id { get; set; }
        public long LeadId { get; set; }
        public string Url { get; set; }
        public DateTime CreatedOn { get; set; }
        public string IP { get; set; }
    }
}
