using AlphaAuthentication.Common;
using AlphaAuthentication.Entity;
using AlphaAuthentication.Models;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace AlphaAuthentication.Controllers
{
    public class AuthenticateController : Controller
    {
        AlphaContext _context;

        public AuthenticateController(AlphaContext context)
        {
            _context = context;
        }
        [Route("Authenticate/Index")]
        [Route("Authenticate")]
        public IActionResult Index(string ac, string id)
        {
            AuthenticationModel model = new AuthenticationModel();
            try
            {
                if (string.IsNullOrEmpty(ac))
                {
                    model.Authentication = false;
                    model.Message = "In-Valid Account Token.";
                    return View(model);
                }
                if (string.IsNullOrEmpty(id))
                {
                    model.Authentication = false;
                    model.Message = "No Lead Id Assigned.";
                    return View(model);
                }
                long authId = 0;
                int bpoId = 0;
                long.TryParse(AppCommon.Decrypt(id), out authId);
                int.TryParse(AppCommon.Decrypt(ac), out bpoId);

                var data = _context.Authentication.Find(authId);

                if (data == null)
                {
                    model.Authentication = false;
                    model.Message = "In-Valid Lead Id";
                    return View(model);
                }
              
                string currentUrl = $"{Request.Scheme}://{Request.Host.Value}";  
                Uri currentUri = new Uri(currentUrl);
                Uri dbUri = new Uri(data.SourceUrl);
                string currentHostAndPort = $"{currentUri.Host}:{currentUri.Port}";
                string dbHostAndPort = $"{dbUri.Host}:{dbUri.Port}";

                if (!string.Equals(currentHostAndPort, dbHostAndPort, StringComparison.OrdinalIgnoreCase))
                {
                    model.Authentication = false;
                    model.Message = "In-Valid URL";
                    return View(model);
                }

                if (data.BPOId != bpoId)
                {
                    model.Authentication = false;
                    model.Message = "In-Valid Account Token";
                    return View(model);
                }
                model.FirstName = data.FirstName;
                model.LastName = data.LastName;
                model.DateOfBirth = data.DateOfBirth;
                model.Authentication = true;
                model.Message = "Authentication Success";
            }
            catch (Exception ex)
            {
                AppCommon.LogException(ex, "AuthenticateController=>Index");
                model.Authentication = false;
                model.Message = AppCommon.ErrorMessage;
            }
            return View(model);
        }

        [Route("Auth")]
        public JsonResult Auth(string ac, string id)
        {
            ResponseModel model = new ResponseModel();
            try
            {
                if (string.IsNullOrEmpty(ac))
                {
                    model.Authentication = false;
                    model.Message = "In-Valid Account Token.";
                    return Json(model);
                }
                if (string.IsNullOrEmpty(id))
                {
                    model.Authentication = false;
                    model.Message = "No Lead Id Assigned.";
                    return Json(model);
                }
                long authId = 0;
                int bpoId = 0;
                long.TryParse(AppCommon.Decrypt(id), out authId);
                int.TryParse(AppCommon.Decrypt(ac), out bpoId);

                var data = _context.Authentication.Find(authId);
                if (data == null)
                {
                    model.Authentication = false;
                    model.Message = "In-Valid Lead Id";
                    return Json(model);
                }

                string currentUrl = $"{Request.Scheme}://{Request.Host.Value}";
                Uri currentUri = new Uri(currentUrl);
                Uri dbUri = new Uri(data.SourceUrl);
                string currentHostAndPort = $"{currentUri.Host}:{currentUri.Port}";
                string dbHostAndPort = $"{dbUri.Host}:{dbUri.Port}";

                if (!string.Equals(currentHostAndPort, dbHostAndPort, StringComparison.OrdinalIgnoreCase))
                {
                    model.Authentication = false;
                    model.Message = "In-Valid URL";
                    return Json(model);
                }


                if (data.BPOId != bpoId)
                {
                    model.Authentication = false;
                    model.Message = "In-Valid Account Token";
                    return Json(model);
                }
                model.Authentication = true;
                model.FirstName = data.FirstName;
                model.LastName = data.LastName;
                model.Message = "Authentication Success";
            }
            catch (Exception ex)
            {
                AppCommon.LogException(ex, "AuthenticateController=>Auth");
                model.Authentication = false;
                model.Message = AppCommon.ErrorMessage;
            }
            return Json(model);
        }
    }
}
