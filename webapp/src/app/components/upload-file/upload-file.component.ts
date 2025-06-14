import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UploadFilesService } from '../../services/upload-files.service';
import { LoadFilesInBrowserService } from '../../services/load-files-in-browser.service';
import { GoBackButtonComponent } from '../go-back-button/go-back-button.component';
import { OpenFileComponent } from '../open-file/open-file.component';
import { FileUploadStatus } from '../../models/file-upload-status.interface';

@Component({
  selector: 'app-upload-files',
  imports: [
    GoBackButtonComponent,
    OpenFileComponent
  ],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent implements OnInit {

  private _file: File | undefined = undefined;
  protected isValidFile: WritableSignal<boolean> = signal(false);

	private toastr = inject(ToastrService);
  private uploadFilesService = inject(UploadFilesService);
  private loadFilesInBrowserService = inject(LoadFilesInBrowserService);

  ngOnInit(): void {}

  loadFile($event: File): void {
    if($event) {
      this.loadFilesInBrowserService.readFile($event).then(result => {
        if(result) {
          if(!this.loadFilesInBrowserService.isValidDataType(result)) {
            this.toastr.error('Invalid type');
            return;
          }
          
          if(!this.loadFilesInBrowserService.checkMaximumSize($event.size)) {
            this.toastr.error('File exceeds limit of 10MB');
            return;
          }

          this._file = $event;
          this.isValidFile.set(true);
        } else {
          this.toastr.error('Invalid file');
        }
      });
    }   
  }

  upload(): void {
    const file: File | undefined = this.getFile();

    if(file) {
      this.uploadFilesService.uploadFile(file).subscribe({
        next: (result: FileUploadStatus) => {
          if(result.hasErrors) {
            this.toastr.error(result.errorMessage ?? 'Unable to upload file');
          } else {
            this.toastr.success('File successfully uploaded.');
          }
        },
        error: () => {
          this.toastr.error('Unable to upload file.');          
        },
        complete: () => {
          this.reset();
        }
      })
    } else {
      this.toastr.error('File is undefined');
    }
  }

  private getFile(): File | undefined {
    if(this._file) {
      return this._file;
    }

    return undefined;
  }

  private reset(): void {
    this._file = undefined;
    this.isValidFile.set(false);
  }

}