using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IVIMYSQL.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //ViewBag.Title = "Home Page";
            //return View();

            var staticPageToRender = new FilePathResult("~/LoginPage.html", "text/html");
            return staticPageToRender;

        }
    }
}
