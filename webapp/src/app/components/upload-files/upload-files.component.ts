import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UploadFilesService } from '../../services/upload-files.service';
import { LoadFilesInBrowserService } from '../../services/load-files-in-browser.service';
import { GoBackButtonComponent } from '../go-back-button/go-back-button.component';
import { OpenFileComponent } from '../open-file/open-file.component';
import { FileUploadStatus } from '../../models/file-upload-status.interface';
import { forkJoin, from, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload-files',
  imports: [
    GoBackButtonComponent,
    OpenFileComponent
  ],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss'
})
export class UploadFilesComponent implements OnInit {

	private _files: File[] | undefined = undefined;
  protected isValidFile: WritableSignal<boolean> = signal(false);

	private toastr = inject(ToastrService);
  private uploadFilesService = inject(UploadFilesService);
  private loadFilesInBrowserService = inject(LoadFilesInBrowserService);

  ngOnInit(): void {}

  loadFiles(files: File[]): void {
    if(files) {
      let allErrors: string = '';

      const checkFiles: Observable<string>[] = [];

      for(let i = 0; i < files.length; i++) {
        checkFiles.push(
          from(this.loadFilesInBrowserService.readFile(files[i])).pipe(
            switchMap((base64: string) => {
              if(!this.loadFilesInBrowserService.isValidDataType(base64)) {
                return of('Invalid type - file: ' + files[i].name + '. ');
              }

              if(!this.loadFilesInBrowserService.checkMaximumSize(files[i].size)) {
                return of('File ' + files[i].name + ' exceeds limit of 10MB. '); 
              }

              return of('');
            })
          )          
        );
      }

      forkJoin(checkFiles).subscribe({
        next: (errors: string[]) => {
          allErrors = errors.join('');
        },
        complete: () => {
          if(allErrors === '') {
            this._files = files;
            this.isValidFile.set(true);
          } else {
            this.toastr.error(allErrors);
          }
        }
      });     
    }   
  }

  upload(): void {
    const files: File[] | undefined = this.getFiles();

    if(files) {
      this.uploadFilesService.uploadFiles(files).subscribe({
        next: (result: FileUploadStatus) => {
          if(result.hasErrors) {
            this.toastr.error(result.errorMessage ?? 'Unable to upload files');
          } else {
            this.toastr.success('Files successfully uploaded.');
          }
        },
        error: () => {
          this.toastr.error('Unable to upload files.');          
        },
        complete: () => {
          this.reset();
        }
      })
    } else {
      this.toastr.error('Files are undefined');
    }
  }

  private getFiles(): File[] | undefined {
    if(this._files) {
      return this._files;
    }

    return undefined;
  }

  private reset(): void {
    this._files = undefined;
    this.isValidFile.set(false);
  }
  
}