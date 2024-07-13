using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DataTransferObjects
{
    public class FileDownloadDto
    {

        public string FileMimeType { get; set; }

        public string FileBase64 { get; set; }

        public string FileName { get; set; }

        public bool HasErrors { get; set; } = false;

        public string? ErrorMessage { get; set; }

    }

}
