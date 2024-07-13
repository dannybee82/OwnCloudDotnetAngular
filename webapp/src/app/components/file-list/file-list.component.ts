import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OwnCloudFileService } from '../../services/own-cloud-file.service';
import { Observable, catchError, map, of } from 'rxjs';
import { FileInfo } from '../../models/file-info.interface';
import { DownloadFile } from '../../shared_methods/download-file';
import { AsyncPipe } from '@angular/common';
import { GoBackButtonComponent } from '../go-back-button/go-back-button.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';  
import { FileDeleted } from '../../models/file-deleted.interface';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    AsyncPipe,
    GoBackButtonComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss'
})
export class FileListComponent implements OnInit {

  allFiles$?: Observable<FileInfo[]>;

  showDialog: WritableSignal<boolean> = signal(false);
  filenameToDelete: WritableSignal<string> = signal('');
  private _deleteThis: FileInfo | undefined = undefined;

  private _downloadFile: DownloadFile = new DownloadFile();

	private toastr = inject(ToastrService);
  private ownCloudFileService = inject(OwnCloudFileService);  

  ngOnInit(): void {
    this.getAllFiles();
  }

  download(filename: string): void {
    this._downloadFile.download(filename);
  }

  showDeleteDialog(file: FileInfo): void {
    this._deleteThis = file;
    this.filenameToDelete.set(file.fileName);
    this.showDialog.set(true);  
  }

  delete($event: boolean): void {
    if($event && this._deleteThis) {
      this.ownCloudFileService.deleteFile(this._deleteThis.filePath).subscribe({
        next: (status: FileDeleted) => {
          if(!status.isDeleted) {
            this.toastr.error('Can\'t delete file. ' + status.errorMessage);
          } else {
            this.toastr.success('File successfully deleted.');
          }
        },
        error: () => {
          this.toastr.error('Unable to delete file.');
        },
        complete: () => {
          this.reset();
          this.getAllFiles();
        }        
      });
    } else {
      this.reset();
    }
  }

  private getAllFiles(): void {
    this.allFiles$ = this.ownCloudFileService.getFileList().pipe(
      map((data: FileInfo[]) => {
        if(data) {
          return data;
        }

        throw new Error('error');
      }),
      catchError((err) => {
        this.toastr.error('Cant fetch files list.');
        return of([]);
      })
    );
  }

  private reset(): void {
    this.showDialog.set(false);
    this.filenameToDelete.set('');
    this._deleteThis = undefined;
  }

}