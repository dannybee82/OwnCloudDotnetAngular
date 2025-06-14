import { Component, InputSignal, input, OutputEmitterRef, output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-open-file',
  templateUrl: './open-file.component.html',
  styleUrls: ['./open-file.component.scss']
})

export class OpenFileComponent {

  readonly buttonColor: InputSignal<string> = input<string>("btn-primary");
  readonly buttonText: InputSignal<string> = input<string>('');
  readonly buttonClass: InputSignal<string> = input<string>('');
  readonly fileExtensions: InputSignal<string> = input<string>('');
  readonly multipleFiles: InputSignal<boolean> = input<boolean>(false);

  readonly selectedFile: OutputEmitterRef<File> = output<File>();
  readonly selectedFiles: OutputEmitterRef<File[]> = output<File[]>();

  onFileSelected(event: any) {
    const files: File[] = event.target.files;
    
    if (files) {
        if(this.multipleFiles()) {
          this.selectedFiles.emit(files);
        } else {
          this.selectedFile.emit(files[0]);
        }        
    }
  }

}