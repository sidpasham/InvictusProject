using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using IVIDataAccessLayer;
using IVIMYSQL.Models;

namespace IVIMYSQL.Controllers
{
    [RoutePrefix("api/User")]
    public class UserAccountController : ApiController
    {
        //[HttpGet]
        //public IEnumerable<tblpost> GetAllPosts()
        //{
        //    using(ivimessageboardEntities entities = new ivimessageboardEntities())
        //    {
        //        return entities.tblposts.ToList();
        //    }
        //}

        //[HttpPost]
        [AcceptVerbs("GET", "POST")]
        [Route("Register")]
        public IHttpActionResult LoginUser(LoginModel loginmodel)
        {
            DBUpdates da = new DBUpdates();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //var response = da.CreateUser(loginmodel.Email, loginmodel.Password);

            //if (!response.isSuccess)
            //{
            //    return GetErrorResult(response);
            //}

            return Ok();
        }

        //[HttpPost]
        [AcceptVerbs("GET", "POST")]
        [Route("Register")]
        public IHttpActionResult Register(RegisterModel registermodel)
        {
            DBUpdates da = new DBUpdates();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //var response = da.CreateUser(registermodel.Email, registermodel.Password);

            //if (!response.isSuccess)
            //{
            //    return GetErrorResult(response);
            //}

            return Ok();
        }

        private IHttpActionResult GetErrorResult(Response result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.isSuccess)
            {
                if (result.ErrorList != null)
                {
                    foreach (string error in result.ErrorList)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}
