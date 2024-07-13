using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Settings
{
    public interface IServiceSettings
    {
        string OwnCloudServer { get; set; }

        string OwnCloudBasePath { get; set; }

        string OwnCloudStripPart { get; set; }
    }

}
