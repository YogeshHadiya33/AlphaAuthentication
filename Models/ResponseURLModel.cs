namespace AlphaAuthentication.Models
{
    public class ResponseURLModel : ResponseModel
    {
        public string AC { get; set; }
        public string Id { get; set; }
        public string SourceURL { get; set; }
        public string FullURL { get; set; }
        public string JsonUrl { get; set; }
    }
}
