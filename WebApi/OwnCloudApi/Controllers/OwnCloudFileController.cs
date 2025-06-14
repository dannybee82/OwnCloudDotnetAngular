using Microsoft.AspNetCore.Mvc;
using ServiceLayer.Services;

namespace TestOwnCloudConnect.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class OwnCloudFileController : ControllerBase
    {
        private readonly IOwnCloudService _ownCloudService;

        public OwnCloudFileController(IOwnCloudService ownCloudService)
        {
            _ownCloudService = ownCloudService;
        }


        [HttpGet("GetFileList")]
        public async Task<IActionResult> GetFileList()
        {
            try
            {
                var response = await _ownCloudService.GetFileList();
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile(string filename)
        {
            try
            {
                var response = await _ownCloudService.DownloadFile(filename);
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        //Note: [FromForm] attribute not working, due to version of Swagger.
        [HttpPost("UploadFile")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            try
            {
                var response = await _ownCloudService.UploadFile(file);
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpPost("UploadFiles")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files)
        {
            try
            {
                var response = await _ownCloudService.UploadFiles(files);
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpPost("UploadDocument")]
        public async Task<IActionResult> UploadDocument(IFormFile file)
        {
            try
            {
                //Upload file to /Documents/ - that is a default folder in OwnCloud.
                var response = await _ownCloudService.UploadFile(file, "/Documents/");
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpPost("UploadDocuments")]
        public async Task<IActionResult> UploadDocuments(List<IFormFile> files)
        {
            try
            {
                //Upload file to /Documents/ - that is a default folder in OwnCloud.
                var response = await _ownCloudService.UploadFiles(files, "/Documents/");
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpPost("UploadPhoto")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            try
            {
                //Upload file to /Photos/ - that is a default folder in OwnCloud.
                var response = await _ownCloudService.UploadFile(file, "/Photos/");
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpPost("UploadPhotos")]
        public async Task<IActionResult> UploadPhotos(List<IFormFile> files)
        {
            try
            {
                //Upload file to /Photos/ - that is a default folder in OwnCloud.
                var response = await _ownCloudService.UploadFiles(files, "/Photos/");
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }

        
        [HttpDelete("DeleteFile")]
        public async Task<IActionResult> DeleteFile(string filename)
        {
            try
            {
                var response = await _ownCloudService.DeleteFile(filename);
                return Ok(response);
            }
            catch
            {
                return BadRequest("Something went wrong.");
            }
        }

    }

}
