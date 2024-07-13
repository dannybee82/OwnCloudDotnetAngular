using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Settings
{
    public class ServiceSettings : IServiceSettings
    {

        public string OwnCloudServer { get; set; } = string.Empty;

        public string OwnCloudBasePath {  get; set; } = string.Empty;

        public string OwnCloudStripPart { get; set; } = string.Empty;
    }
}
