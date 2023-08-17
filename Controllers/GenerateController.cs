using AlphaAuthentication.Common;
using AlphaAuthentication.Entity;
using AlphaAuthentication.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace AlphaAuthentication.Controllers
{
    [Route("[controller]/[action]")]
    public class GenerateController : Controller
    {
        AlphaContext _context;

        public GenerateController(AlphaContext context)
        {
            _context = context;
        }


        public IActionResult Index()
        {
            return View();
        }

        public PartialViewResult Generate(string id)
        {
            ResponseURLModel model = new ResponseURLModel();
            try
            {
                long leadId = 0;
                string pattern = "[^0-9]";
                string numericString = Regex.Replace(id, pattern, "");
                long.TryParse(numericString, out leadId);

                var data = _context.Authentication.FirstOrDefault(x => x.LeadId == leadId);
                if (data != null)
                {
                    model.AC = AppCommon.Encrypt(data.BPOId.ToString());
                    model.Id = AppCommon.Encrypt(data.LeadId.ToString());
                    model.SourceURL = data.SourceUrl;
                    if (data.SourceUrl.LastOrDefault() != '/')
                        data.SourceUrl = data.SourceUrl + "/";
                    model.FullURL = $"{data.SourceUrl}Authenticate?ac={model.AC}&id={model.Id}";
                    model.JsonUrl = $"{data.SourceUrl}Auth?ac={model.AC}&id={model.Id}";

                    data.JsonUrl = model.JsonUrl;
                    _context.Authentication.Update(data);
                    _context.SaveChanges();
                    model.Authentication = true;
                }
                else
                {
                    model.Authentication = false;
                    model.Message = "No record found with this ID";
                }
            }
            catch (Exception ex)
            {
                AppCommon.LogException(ex, "GenerateController=>Generate");
                model.Authentication = false;
                model.Message = AppCommon.ErrorMessage;
            }
            return PartialView(model);
        }
    }
}
