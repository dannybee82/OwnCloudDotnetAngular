import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileInfo } from '../models/file-info.interface';
import { FileDownload } from '../models/file-download.interface';
import { FileDeleted } from '../models/file-deleted.interface';

const api: string = environment.endpoint  + environment.controllerName;;

@Injectable({
  providedIn: 'root'
})
export class OwnCloudFileService {

  private http = inject(HttpClient);

  getFileList(): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(api + 'GetFileList');
  }

  downloadFile(filename: string): Observable<FileDownload> {
    const params: HttpParams = new HttpParams().append('filename', filename);
    return this.http.get<FileDownload>(api + 'DownloadFile', {params});
  }

  deleteFile(filename: string): Observable<FileDeleted> {
    const params: HttpParams = new HttpParams().append('filename', filename);
    return this.http.delete<FileDeleted>(api + 'DeleteFile', {params});
  }

}