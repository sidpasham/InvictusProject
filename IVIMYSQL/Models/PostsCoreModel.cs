using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IVIMYSQL.Models
{
    public class CreatePost
    {
        [Required]
        [Display(Name = "PostAuthor")]
        public string PostAuthor { get; set; }

        [Required]
        [Display(Name = "PostTitle")]
        public string PostTitle { get; set; }

        [Display(Name = "PostCategoryId")]
        public int PostCategoryId { get; set; }

        [Required]
        [Display(Name = "PostDescription")]
        public string PostDescription { get; set; }

        [Required]
        [Display(Name = "PostDate")]
        public DateTime PostDate { get; set; }

        [Required]
        [Display(Name = "Postfiles")]
        public List<byte[]> Postfiles { get; set; }
    }

    public class ReplyPost
    {
        [Display(Name = "PostId")]
        public int PostId { get; set; }

        [Required]
        [Display(Name = "PostAuthor")]
        public string PostAuthor { get; set; }

        [Required]
        [Display(Name = "PostDescription")]
        public string PostDescription { get; set; }

        [Required]
        [Display(Name = "PostDate")]
        public string PostDate { get; set; }
    }
}