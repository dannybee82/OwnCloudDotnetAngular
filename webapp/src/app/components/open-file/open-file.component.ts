import { Component, InputSignal, input, OutputEmitterRef, output, EventEmitter, Input } from '@angular/core';

@Component({
	standalone: true,
  selector: 'app-open-file',
  templateUrl: './open-file.component.html',
  styleUrls: ['./open-file.component.scss']
})

export class OpenFileComponent {

  buttonColor: InputSignal<string> = input<string>("btn-primary");
  buttonText: InputSignal<string> = input<string>('');
  buttonClass: InputSignal<string> = input<string>('');
  fileExtensions: InputSignal<string> = input<string>('');
  multipleFiles: InputSignal<boolean> = input<boolean>(false);

  selectedFile: OutputEmitterRef<File> = output<File>();
  selectedFiles: OutputEmitterRef<File[]> = output<File[]>();

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