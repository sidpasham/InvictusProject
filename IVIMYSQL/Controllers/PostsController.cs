using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using IVIDataAccessLayer;
using System.Threading.Tasks;
using IVIMYSQL.Models;
using System.Web.Routing;
using System.Globalization;
using System.Web;
using System.Diagnostics;
using System.IO;

namespace IVIMYSQL.Controllers
{
    [Authorize]
    public class PostsController : ApiController
    {
        DBUpdates dbupdates = new DBUpdates();
        Response response = new Response();

        #region ALL GET METHODS

        // GET api/posts
        [HttpGet]
        public IEnumerable<tblpostswithreply> GetAllPosts()
        {
            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                try
                {
                    var allposts = from item in entities.tblposts
                                   join category in entities.tblcategories on item.postcategoryid equals category.CategoriesId into cats
                                   from category in cats.DefaultIfEmpty()
                                   orderby item.postdate descending
                                   select new tblpostswithreply
                                   {
                                       idposts = item.idposts,
                                       postdate = item.postdate,
                                       postauthor = item.postauthor,
                                       postcategory = category.CategoryName,
                                       posttitle = item.posttitle,
                                       postdescription = item.postdescription,
                                       postreplies = item.postreplies
                                   };
                    return allposts.ToList();
                }
                catch (Exception ex)
                {
                    dbupdates.TapErrortoDB(entities, ex.ToString(), "PostsController", "GetAllPosts");
                    return null;
                }
            }
        }

        // GET api/posts/posttitle
        [HttpGet]
        [Route("api/posts/searchposts/{searchpostby}/{searchstring}")]
        public List<tblpostswithreply> Get(string searchpostby, string searchstring)
        {
            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                List<tblpostswithreply> searchposts = new List<tblpostswithreply>();
                try
                {
                    var allposts = (from item in entities.tblposts
                                    join category in entities.tblcategories on item.postcategoryid equals category.CategoriesId into cats
                                    from category in cats.DefaultIfEmpty()
                                    orderby item.postdate descending
                                    select new tblpostswithreply
                                    {
                                        idposts = item.idposts,
                                        postdate = item.postdate,
                                        postauthor = item.postauthor,
                                        postcategory = category.CategoryName,
                                        posttitle = item.posttitle,
                                        postdescription = item.postdescription,
                                        postreplies = item.postreplies
                                    }).ToList();

                    if (searchpostby.ToLower() == "title")
                    {
                        searchposts = (from item in allposts.AsEnumerable()
                                       where item.posttitle.ToLower().Contains(searchstring.ToLower())
                                       select item).OrderByDescending(x => x.postdate).ToList();
                    }
                    else if (searchpostby.ToLower() == "author")
                    {
                        searchposts = (from item in allposts.AsEnumerable()
                                       where item.postauthor.ToLower().Contains(searchstring.ToLower())
                                       select item).OrderByDescending(x => x.postdate).ToList();
                    }
                    else if (searchpostby.ToLower() == "category")
                    {
                        searchposts = (from item in allposts.AsEnumerable()
                                       where item.postcategory.ToLower().Contains(searchstring.ToLower())
                                       select item).OrderByDescending(x => x.postdate).ToList();
                    }
                    else if (searchpostby.ToLower() == "description")
                    {
                        searchposts = (from item in allposts.AsEnumerable()
                                       where item.postdescription.ToLower().Contains(searchstring.ToLower())
                                       select item).OrderByDescending(x => x.postdate).ToList();
                    }
                    else if (searchpostby.ToLower() == "allposts")
                    {
                        searchposts = allposts;
                    }

                    return searchposts;
                }
                catch (Exception ex)
                {
                    //dbupdates.TapErrortoDB(entities, ex.ToString(), "PostsController", "GetAllPosts");
                    return null;
                }
            }
        }

        // GET api/posts/getposts
        [HttpGet]
        [Route("api/posts/{postid}/viewpost")]
        public List<tblpostswithreply> Get(int postid)
        {
            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                try
                {
                    var searchpostswithreplies = from item in entities.tblposts
                                                 join reply in entities.tblpostreplies on item.idposts equals reply.idreplyparent
                                                 join category in entities.tblcategories on item.postcategoryid equals category.CategoriesId into cats
                                                 from category in cats.DefaultIfEmpty()
                                                 where item.idposts == postid
                                                 select new tblpostswithreply
                                                 {
                                                     idposts = item.idposts,
                                                     posttitle = item.posttitle,
                                                     postcategory = category.CategoryName,
                                                     postdescription = item.postdescription,
                                                     postauthor = item.postauthor,
                                                     postdate = item.postdate,
                                                     postreplydescription = reply.postreplydescription,
                                                     postreplyauthor = reply.postreplyauthor,
                                                     postreplydate = reply.postreplydate
                                                 };

                    var listpostswithreplies = searchpostswithreplies.ToList();

                    if (listpostswithreplies.Count == 0)
                    {
                        var searchposts = from item in entities.tblposts
                                          join category in entities.tblcategories on item.postcategoryid equals category.CategoriesId into cats
                                          from category in cats.DefaultIfEmpty()
                                          where item.idposts == postid
                                          select new tblpostswithreply
                                          {
                                              idposts = item.idposts,
                                              posttitle = item.posttitle,
                                              postcategory = category.CategoryName,
                                              postdescription = item.postdescription,
                                              postauthor = item.postauthor,
                                              postdate = item.postdate,
                                          };

                        return searchposts.ToList();
                    }
                    else
                    {
                        return listpostswithreplies;
                    }
                }
                catch (Exception ex)
                {
                    //dbupdates.TapErrortoDB(entities, ex.ToString(), "PostsController", "GetAllPosts");
                    return null;
                }

            }
        }

        // GET api/categories
        [HttpGet]
        [Route("api/categories")]
        public IEnumerable<tblcategory> GetAllCategories()
        {
            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                return entities.tblcategories.ToList();
            }
        }

        // POST api/posts/UpdateNotice
        [HttpGet]
        [Route("api/posts/getAdminNotice")]
        public string GetAdminNotice()
        {
            var xmlpath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/AdminData.xml");
            return dbupdates.GetAdminNotice(xmlpath);
        }
        #endregion

        #region ALL POST METHODS

        // POST api/posts/CreatePost
        [HttpPost]
        [Route("api/posts/CreatePost")]
        public IHttpActionResult CreatePost([FromBody]CreatePost createpostmodel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            response = dbupdates.DBCreatePost(createpostmodel.PostAuthor, createpostmodel.PostCategoryId, createpostmodel.PostTitle, createpostmodel.PostDescription, createpostmodel.PostDate);

            if (!response.isSuccess)
            {
                return GetErrorResult(response);
            }

            return Ok();
        }

        // POST api/posts/ReplyPost
        [HttpPost]
        [Route("api/posts/ReplyPost")]
        public IHttpActionResult ReplyPost([FromBody]ReplyPost replypostmodel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            response = dbupdates.addReplytoPost(replypostmodel.PostId, replypostmodel.PostAuthor, replypostmodel.PostDescription, replypostmodel.PostDate);

            if (!response.isSuccess)
            {
                return GetErrorResult(response);
            }

            return Ok();
        }

        // POST api/posts/addCategory
        [HttpPost]
        [Route("api/posts/addCategory")]
        public IHttpActionResult AddCategory([FromUri]string CategoryName)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            response = dbupdates.CreateCategory(CategoryName);

            if (!response.isSuccess)
            {
                return GetErrorResult(response);
            }

            return Ok();
        }

        // POST api/posts/UpdateNotice
        [HttpPost]
        [Route("api/posts/updateNotice")]
        public IHttpActionResult UpdateNotice([FromUri]string notice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (notice != null && notice != "")
            {
                var xmlpath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/AdminData.xml");
                response = dbupdates.UpdateNotice(notice, xmlpath);
            }
            else
            {
                response.isSuccess = false;
                response.ErrorList.Add("Admin Notice Value is Blank or NULL. Please Provide a valid value.");
            }

            if (!response.isSuccess)
            {
                return GetErrorResult(response);
            }

            return Ok();
        }

        //Post a form Data
        [HttpPost]
        [Route("api/posts/uploadfile")]
        public async Task<HttpResponseMessage> PostFormData()
        {
            byte[] uploadfilebytes = null;
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var httppostedfile = HttpContext.Current.Request.Files["Uploadedfile"];
                if (httppostedfile != null)
                {

                    using (var binaryReader = new BinaryReader(httppostedfile.InputStream))
                    {
                        uploadfilebytes = binaryReader.ReadBytes(httppostedfile.ContentLength);
                    }
                    //httppostedfile.SaveAs(@"C:\Users\SadhaShivaSiddhanth\Desktop\abcd.docx");
                }
            }
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                // This illustrates how to get the file names.
                foreach (MultipartFileData file in provider.FileData)
                {
                    var filename = file.Headers.ContentDisposition.FileName;
                    var filenamewithpath = file.LocalFileName;

                }
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }
        #endregion

        #region ERROR METHODS
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
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
        #endregion

    }

}
