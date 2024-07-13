using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DataTransferObjects
{
    public class FileInfoDto
    {

        public string FilePath { get; set; } = string.Empty;

        public string FileName { get; set; } = string.Empty;

        public string FileExtension { get; set; } = string.Empty; 

    }
}
