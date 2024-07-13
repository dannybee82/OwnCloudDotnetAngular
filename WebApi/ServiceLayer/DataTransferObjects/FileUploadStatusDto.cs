using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DataTransferObjects
{
    public class FileUploadStatusDto
    {
        public bool HasErrors { get; set; } = false;

        public string? ErrorMessage { get; set; }

    }

}