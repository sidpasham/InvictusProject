using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IVIDataAccessLayer
{
    public class Response
    {
        public bool isSuccess { get; set; }
        public List<string> ErrorList { get; set;}
    }
}
