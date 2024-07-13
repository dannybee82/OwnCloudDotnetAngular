using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Helpers
{
    public class FileHelpers
    {

        public static string GetFileName(string path)
        {
            string[] splitted = path.Split('/');
            int lastPart = splitted.Length - 1;

            return lastPart > -1 ? splitted[lastPart] : "";
        }

        public static string GetFileExtension(string path)
        {
            string fileName = GetFileName(path);
            string[] spltted = fileName.Split('.');
            int lastPart = spltted.Length - 1;

            return lastPart > -1 ? spltted[lastPart] : "";
        }

    }

}