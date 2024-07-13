using FileSignatures;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ServiceLayer.DataTransferObjects;
using ServiceLayer.Helpers;
using ServiceLayer.Settings;
using System.Net;
using System.Text.Json;
using WebDav;

namespace ServiceLayer.Services
{
    public class OwnCloudService : IOwnCloudService
    {
        private IWebDavClient _webDavClient;

        private readonly IServiceSettings _serviceSettings;

        private readonly IFileFormatInspector _fileFormatInspector;

        private readonly IAllowedFileFormatList _allowedFileFormatList;

        public OwnCloudService(
            IWebDavClient webDavClient,
            IServiceSettings serviceSettings,
            IFileFormatInspector fileFormatInspector,
            IAllowedFileFormatList allowedFileFormatList
        )
        {
            _webDavClient = webDavClient;
            _serviceSettings = serviceSettings;
            _fileFormatInspector = fileFormatInspector;
            _allowedFileFormatList = allowedFileFormatList;
        }

        public async Task<List<FileInfoDto>> GetFileList()
        {
            try
            {
                List<string> allDirs = await GetDirectories("/");

                for (int i = 0; i < allDirs.Count(); i++)
                {
                    if (!allDirs[i].Equals("/"))
                    {
                        List<string> children = await GetDirectories(allDirs[i]);

                        if (children.Count() > 0)
                        {
                            foreach (var child in children)
                            {
                                if (!allDirs.Contains(child))
                                {
                                    allDirs.Add(child);
                                }
                            }
                        }
                    }
                }

                List<FileInfoDto> allFiles = new();

                if (allDirs.Count() > 0)
                {
                    foreach (var directory in allDirs)
                    {
                        List<string> files = await GetFiles(directory);

                        if (files.Count() > 0)
                        {
                            foreach (var file in files)
                            {
                                FileInfoDto info = new();
                                info.FilePath = file;
                                info.FileName = FileHelpers.GetFileName(file);
                                info.FileExtension = FileHelpers.GetFileExtension(file);

                                allFiles.Add(info);
                            }
                        }
                    }
                }

                return allFiles;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<FileDownloadDto> DownloadFile(string file)
        {
            FileDownloadDto dto = new();

            var response = await _webDavClient.GetRawFile(_serviceSettings.OwnCloudServer + file);

            if (response.IsSuccessful)
            {
                try
                {
                    Stream source = response.Stream;
                    MemoryStream ms = new MemoryStream();
                    source.CopyTo(ms);
                    ms.Position = 0;

                    var bytes = ms.ToArray();

                    dto.FileName = FileHelpers.GetFileName(file);
                    dto.FileMimeType = MimeTypes.GetMimeType(FileHelpers.GetFileName(file));
                    dto.FileBase64 = Convert.ToBase64String(bytes);
                }
                catch (Exception ex)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = ex.Message;
                }
            }
            else
            {
                dto.HasErrors = true;
                dto.ErrorMessage = "File not found.";
            }

            response.Dispose();

            return dto;
        }


        public async Task<FileUploadStatusDto> UploadFile(IFormFile file)
        {
            FileUploadStatusDto dto = new();

            try
            {
                if (file == null)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = "Argument null";
                    return dto;
                }

                if (file.Length == 0)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = "File not selected";
                    return dto;
                }

                var fileName = file.FileName;
                var fileStream = file.OpenReadStream();
                var fileExtension = FileHelpers.GetFileExtension(fileName);

                var fileFormat = _fileFormatInspector.DetermineFileFormat(fileStream);

                var record = _allowedFileFormatList.AllowedFileList.SingleOrDefault(x => x.Extension.Equals(fileExtension) && x.FileFormat.Any(y => y.Equals(fileFormat)));

                if (record == null)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = $"Error: {fileName} - Not allowed file format.";
                    return dto;
                }

                await _webDavClient.PutFile(_serviceSettings.OwnCloudServer + _serviceSettings.OwnCloudBasePath + fileName, fileStream);
            }
            catch (Exception ex)
            {
                dto.HasErrors = true;
                dto.ErrorMessage = ex.Message;
            }

            return dto;
        }


        public async Task<FileUploadStatusDto> UploadFiles(List<IFormFile> files)
        {
            FileUploadStatusDto dto = new();
            string errors = "";

            foreach (var file in files)
            {
                try
                {
                    if (file == null)
                    {
                        dto.HasErrors = true;
                        errors += "Argument null. ";
                        return dto;
                    }

                    if (file.Length == 0)
                    {
                        dto.HasErrors = true;
                        errors += "File not selected. ";
                        return dto;
                    }

                    var fileName = file.FileName;
                    var fileStream = file.OpenReadStream();
                    var fileExtension = FileHelpers.GetFileExtension(fileName);

                    var fileFormat = _fileFormatInspector.DetermineFileFormat(fileStream);

                    var record = _allowedFileFormatList.AllowedFileList.SingleOrDefault(x => x.Extension.Equals(fileExtension) && x.FileFormat.Any(y => y.Equals(fileFormat)));

                    if (record == null)
                    {
                        dto.HasErrors = true;
                        errors += $"Error: {fileName} - Not allowed file format.";
                        return dto;
                    }

                    await _webDavClient.PutFile(_serviceSettings.OwnCloudServer + _serviceSettings.OwnCloudBasePath + fileName, fileStream);
                }
                catch (Exception ex)
                {
                    dto.HasErrors = true;
                    errors += ex.Message + ". ";
                }
            }

            if (!errors.Equals(""))
            {
                dto.ErrorMessage = errors;
            }

            return dto;
        }


        public async Task<FileUploadStatusDto> UploadFile(IFormFile file, string targetDirectory)
        {
            targetDirectory = targetDirectory.StartsWith("/") ? targetDirectory : "/" + targetDirectory;
            targetDirectory = targetDirectory.EndsWith("/") ? targetDirectory : targetDirectory + "/";

            FileUploadStatusDto dto = new();

            try
            {
                if (file == null)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = "Argument null";
                    return dto;
                }

                if (file.Length == 0)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = "File not selected";
                    return dto;
                }

                var fileName = file.FileName;
                var fileStream = file.OpenReadStream();
                var fileExtension = FileHelpers.GetFileExtension(fileName);

                var fileFormat = _fileFormatInspector.DetermineFileFormat(fileStream);

                var record = _allowedFileFormatList.AllowedFileList.SingleOrDefault(x => x.Extension.Equals(fileExtension) && x.FileFormat.Any(y => y.Equals(fileFormat)));

                if (record == null)
                {
                    dto.HasErrors = true;
                    dto.ErrorMessage = $"Error: {fileName} - Not allowed file format.";
                    return dto;
                }

                await _webDavClient.PutFile(_serviceSettings.OwnCloudServer + targetDirectory + fileName, fileStream);
            }
            catch (Exception ex)
            {
                dto.HasErrors = true;
                dto.ErrorMessage = ex.Message;
            }

            return dto;
        }


        public async Task<FileUploadStatusDto> UploadFiles(List<IFormFile> files, string targetDirectory)
        {
            targetDirectory = targetDirectory.StartsWith("/") ? targetDirectory : "/" + targetDirectory;
            targetDirectory = targetDirectory.EndsWith("/") ? targetDirectory : targetDirectory + "/";

            FileUploadStatusDto dto = new();
            string errors = "";

            foreach (var file in files)
            {
                try
                {
                    if (file == null)
                    {
                        dto.HasErrors = true;
                        errors += "Argument null. ";
                        return dto;
                    }

                    if (file.Length == 0)
                    {
                        dto.HasErrors = true;
                        errors += "File not selected.";
                        return dto;
                    }

                    var fileName = file.FileName;
                    var fileStream = file.OpenReadStream();
                    var fileExtension = FileHelpers.GetFileExtension(fileName);

                    var fileFormat = _fileFormatInspector.DetermineFileFormat(fileStream);

                    var record = _allowedFileFormatList.AllowedFileList.SingleOrDefault(x => x.Extension.Equals(fileExtension) && x.FileFormat.Any(y => y.Equals(fileFormat)));

                    if (record == null)
                    {
                        dto.HasErrors = true;
                        errors += $"Error: {fileName} - Not allowed file format.";
                        return dto;
                    }

                    await _webDavClient.PutFile(_serviceSettings.OwnCloudServer + targetDirectory + fileName, fileStream);
                }
                catch (Exception ex)
                {
                    dto.HasErrors = true;
                    errors += ex.Message + ". ";
                }
            }

            if (!errors.Equals(""))
            {
                dto.ErrorMessage = errors;
            }

            return dto;
        }


        public async Task<FileDeletedDto> DeleteFile(string file)
        {
            FileDeletedDto dto = new();

            try
            {
                await _webDavClient.Delete(_serviceSettings.OwnCloudServer + file);
                dto.IsDeleted = true;
            }
            catch (Exception ex)
            {
                dto.IsDeleted = false;
                dto.ErrorMessage = "Can\'t delete file: " + ex.Message;
            }

            return dto;
        }


        private async Task<List<string>> GetDirectories(string path)
        {
            List<string> directories = new();

            var response = await _webDavClient.Propfind(_serviceSettings.OwnCloudServer + path);

            if (response.IsSuccessful)
            {
                var resources = response.Resources;

                foreach (var resource in resources)
                {
                    if (resource.IsCollection)
                    {
                        directories.Add(resource.Uri.ToString().Replace(_serviceSettings.OwnCloudStripPart, ""));
                    }
                }
            }

            return directories;
        }


        private async Task<List<string>> GetFiles(string path)
        {
            List<string> files = new();

            var response = await _webDavClient.Propfind(_serviceSettings.OwnCloudServer + path);

            if (response.IsSuccessful)
            {
                var resources = response.Resources;

                foreach (var resource in resources)
                {
                    if (!resource.IsCollection)
                    {
                        files.Add(resource.Uri.ToString().Replace(_serviceSettings.OwnCloudStripPart, ""));
                    }
                }
            }

            return files;
        }

    }

}