using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IVIDataAccessLayer
{
    public class tblpostswithreply
    {
        public int idposts { get; set; }
        public string posttitle { get; set; }
        public string postcategory { get; set; }
        public string postdescription { get; set; }
        public string postauthor { get; set; }
        public DateTime postdate { get; set; }
        public Nullable<int> postreplies { get; set; }
        public string postreplydescription { get; set; }
        public string postreplyauthor { get; set; }
        public string postreplydate { get; set; }
    }
}
