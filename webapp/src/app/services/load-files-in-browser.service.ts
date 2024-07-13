import { Injectable } from '@angular/core';
import { FileModel } from '../models/file-model';

@Injectable({
  providedIn: 'root'
})
export class LoadFilesInBrowserService {

  private _allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'gif'];
  private _allowedTypes: string[] = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf', 'text/csv', 'image/gif'];

  private readonly MAX_SIZE: number = 10 * (1024 * 1024);

  readFile(file: File) : Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = () => {
            resolve(fr.result as string);
        }
        fr.readAsDataURL(file);
    });
  }

  isValidDataType(data: string) : boolean {
    data = (data.length > 50) ? data.substring(0, 50) : data;

    if(data.toLowerCase().indexOf('base64') == -1) {
      return false;
    }

    let to: number = data.toLowerCase().indexOf('base64');
    let test: string = data.substring(0, to);

    if(this._allowedTypes.length > 0) {
      for(let i = 0; i < this._allowedTypes.length; i++) {
        let found: number = test.indexOf('data:' + this._allowedTypes[i] + ';');

        if(found > - 1) {
          return true;
        }
      }
    }
    
    return false;
  }

  fileToBlob(file: File, fileName: string) : FileModel | undefined {
    let extension: string = this.getFileExtension(fileName);

    let found: number = this._allowedExtensions.indexOf(extension);

    if(found > -1) {
      return new FileModel(fileName, new Blob([file], {type: this._allowedTypes[found]}));
    }

    return undefined;
  }
  
  getFileSize(data: string) : number {        
    let val: number = (data.endsWith('==')) ? 2 : 1;
    let size: number = ((((data.length - val) * 6) / 8) / 1000) / 1000;
    return size;
  }

  getFileExtension(fileName: string) : string {
    let splitted: string[] = fileName.toLowerCase().split('.');
    let lastPart: number = splitted.length - 1;
    return splitted[lastPart];
  }

  getFilenameFromPath(path: string) : string {
    let splittedPath: string[] = path.split('/');
    let lastPartPath: number = splittedPath.length - 1;
    return splittedPath[lastPartPath];
  }

  checkMaximumSize(size: number) : boolean {
    if(size < this.MAX_SIZE) {
      return true;
    }

    return false;
  }

}