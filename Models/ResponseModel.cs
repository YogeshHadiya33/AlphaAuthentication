namespace AlphaAuthentication.Models
{
    public class ResponseModel
    {
        public bool Authentication { get; set; }
        public string Message { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
