using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Web;
using System.IO;

namespace IVIDataAccessLayer
{
    public class DBUpdates
    {
        Response response = new Response();

        #region DB METHODS

        //Create Post and update into DB
        public Response DBCreatePost(string postauthor, int postcategoryid, string posttitle, string postdescription, DateTime postdate)
        {
            tblpost post = new tblpost();
            //byte allfiles = byte.Join(",", postfiles);

            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                post.postauthor = postauthor;
                post.posttitle = posttitle;
                post.postcategoryid = postcategoryid;
                post.postdescription = postdescription;
                post.postdate = postdate;
                //post.postfileuploaded = allfiles;

                try
                {
                    entities.tblposts.Add(post);
                    entities.SaveChanges();
                    response.isSuccess = true;
                    return response;
                }
                catch (Exception ex)
                {
                    TapErrortoDB(entities, ex.ToString(), "DBUpdates", "Createpost");
                    response.isSuccess = false;
                    return response;
                }

            }
        }

        //Create Category and update into DB
        public Response CreateCategory(string CategoryName)
        {
            tblcategory category = new tblcategory();

            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                category.CategoryName = CategoryName;
                try
                {
                    entities.tblcategories.Add(category);
                    entities.SaveChanges();
                    response.isSuccess = true;
                    return response;
                }
                catch (Exception ex)
                {
                    TapErrortoDB(entities, ex.ToString(), "DBUpdates", "CreateCategory");
                    response.isSuccess = false;
                    return response;
                }

            }
        }

        //Get Admin Notice from DB
        public string GetAdminNotice(string xmlpath)
        {
            string adminnotice;
            try
            {

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(xmlpath);

                XmlNode AdminNotice = xmlDoc.SelectSingleNode("AdminNotice");
                adminnotice = AdminNotice.InnerText;
                return adminnotice;
            }
            catch (Exception ex)
            {
                adminnotice = "";
                return adminnotice;
            }

        }

        //Update Admin Notice and update in App_Data/AdminData.xml File
        public Response UpdateNotice(string updatenotice, string xmlpath)
        {
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(xmlpath);

                XmlNode AdminNotice = xmlDoc.SelectSingleNode("AdminNotice");
                AdminNotice.InnerText = updatenotice;
                xmlDoc.Save(xmlpath);
                response.isSuccess = true;
                return response;
            }
            catch (Exception ex)
            {
                response.isSuccess = false;
                response.ErrorList.Add(ex.ToString());
                return response;
            }

        }

        //Add replies to Post and update into DB
        public Response addReplytoPost(int postid, string replyauthor, string replydescription, string replydate)
        {
            tblpostreply replypost = new tblpostreply();

            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                replypost.idreplyparent = postid;
                replypost.postreplyauthor = replyauthor;
                replypost.postreplydescription = replydescription;
                replypost.postreplydate = replydate;

                try
                {
                    entities.tblpostreplies.Add(replypost);

                    var replycount = (from item in entities.tblposts.ToList().AsEnumerable()
                                      where item.idposts == postid
                                      select item).FirstOrDefault();

                    replycount.postreplies = ((replycount.postreplies == null) ? 0 : replycount.postreplies) + 1;
                    entities.SaveChanges();
                    response.isSuccess = true;
                    return response;
                }
                catch (Exception ex)
                {
                    TapErrortoDB(entities, ex.ToString(), "DBUpdates", "addReplytoPost");
                    response.isSuccess = false;
                    return response;
                }

            }
        }

        //Get Security Question from DB
        public string GetSecurityQuestion(string useremail)
        {

            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                try
                {
                    var usersecurityquestion = (from item in entities.tblUserSecurities.ToList().AsEnumerable()
                                                where item.UserEmail.ToLower() == useremail.ToLower()
                                                select item.UserSecurityQuestion).FirstOrDefault();

                    if (usersecurityquestion != null && usersecurityquestion != null)
                    {
                        return usersecurityquestion;
                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    TapErrortoDB(entities, ex.ToString(), "DBUpdates", "GetSecurityQuestion");
                    return null;
                }

            }
        }

        //Check if Security Question is correct or not in DB
        public Response IsSecurityValid(string useremail, string securityanswer)
        {
            Response result = new Response();
            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                try
                {
                    var issecureanswer = (from item in entities.tblUserSecurities.ToList().AsEnumerable()
                                          where item.UserEmail.ToLower() == useremail.ToLower()
                                          select item.UserSecurityAnswer).FirstOrDefault();

                    if (issecureanswer.ToLower() == securityanswer.ToLower())
                    {
                        result.isSuccess = true;
                        return result;
                    }
                    else
                    {
                        result.isSuccess = false;
                        result.ErrorList = new List<string> { "Answer for Security Question is Incorrect. Please Enter the Correct Security Answer." };
                        return result;
                    }
                }
                catch (Exception ex)
                {
                    TapErrortoDB(entities, ex.ToString(), "DBUpdates", "IsSecurityValid");
                    result.isSuccess = false;
                    return result;
                }

            }
        }

        //Check if Security Question is correct or not in DB
        public void updateSecurityQuestion(string useremail, string securityquestion, string securityanswer)
        {
            tblUserSecurity tblUserSecurity = new tblUserSecurity();

            using (ivimessageboardEntities entities = new ivimessageboardEntities())
            {
                try
                {
                    if (securityquestion.ToLower() != "allquestions")
                    {
                        tblUserSecurity.UserEmail = useremail;
                        tblUserSecurity.UserSecurityQuestion = securityquestion;
                        tblUserSecurity.UserSecurityAnswer = securityanswer;
                        entities.tblUserSecurities.Add(tblUserSecurity);
                        entities.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    TapErrortoDB(entities, ex.ToString(), "DBUpdates", "updateSecurityQuestion");
                }
            }
        }

        #endregion

        #region ERROR METHODS

        public void TapErrortoDB(ivimessageboardEntities DBentities, string errortext, string classname, string methodname)
        {
            try
            {
                tblError error = new tblError();
                error.ErrorText = errortext;
                error.ErrorClassName = classname;
                error.ErrorMethodName = methodname;
                DBentities.tblErrors.Add(error);
                DBentities.SaveChanges();
            }
            catch (Exception ex)
            {

            }

        }
        #endregion

    }
}
