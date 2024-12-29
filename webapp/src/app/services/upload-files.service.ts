import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileUploadStatus } from '../models/file-upload-status.interface';

const api: string = environment.endpoint + environment.controllerName;

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private http = inject(HttpClient);

  uploadFile(file: File): Observable<FileUploadStatus> {
    const input = new FormData();
    input.append('file', file, file.name);

    return this.http.post<FileUploadStatus>(api + 'UploadFile', input);
  }

  uploadFiles(files: File[]): Observable<FileUploadStatus> {
    const input = new FormData();
    for(let i = 0; i < files.length; i++) {
      input.append('files', files[i], files[i].name);
    }

    return this.http.post<FileUploadStatus>(api + 'UploadFiles', input);
  }

}