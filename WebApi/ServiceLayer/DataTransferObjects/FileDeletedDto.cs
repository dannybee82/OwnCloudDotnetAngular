using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DataTransferObjects
{
    public class FileDeletedDto
    {

        public bool IsDeleted { get; set; } = true;

        public string? ErrorMessage { get; set; }

    }

}