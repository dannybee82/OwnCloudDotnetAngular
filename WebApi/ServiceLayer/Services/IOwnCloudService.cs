using Microsoft.AspNetCore.Http;
using ServiceLayer.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services
{
    public interface IOwnCloudService
    {

        Task<List<FileInfoDto>> GetFileList();

        Task<FileDownloadDto> DownloadFile(string file);

        Task<FileUploadStatusDto> UploadFile(IFormFile file);

        Task<FileUploadStatusDto> UploadFiles(List<IFormFile> files);

        Task<FileUploadStatusDto> UploadFile(IFormFile file, string targetDirectory);

        Task<FileUploadStatusDto> UploadFiles(List<IFormFile> files, string targetDirectory);

        Task<FileDeletedDto> DeleteFile(string file);

    }

}