import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { OwnCloudFileService } from "../services/own-cloud-file.service";
import { FileDownload } from "../models/file-download.interface";

export class DownloadFile {

    fileService = inject(OwnCloudFileService);
    toastr = inject(ToastrService);

    download(filename: string) : void {
        if(filename !== '') {
            this.fileService.downloadFile(filename).subscribe({
              next: (result: FileDownload) => {
                if(!result.hasErrors) {          
                  try {
                    console.log(result);
                    let link = document.createElement('a');
                    link.href = `data:${result.fileMimeType};base64,` + result.fileBase64;
                    //link.href = result.fileBase64;
                    link.download = result.fileName ?? 'unknown_download';
                    link.dispatchEvent(new MouseEvent('click'));
            
                    this.toastr.success('File successfully downloaded.');
                  } catch {
                    this.toastr.error('Can\'t download file.');
                  }          
                } else {
                  this.toastr.error(result.errorMessage ?? 'Can\'t download file.');
                }
              },
              error: () => {
                this.toastr.error('Can\'t download file.');
              }
            });
        } else {
            this.toastr.error('Can\'t download file. The file has no name.');
        }
    };

}