import { Component, InputSignal, input, OutputEmitterRef, output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	standalone: true,
	imports: [
		CommonModule,
	],
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  title: InputSignal<string> = input<string>('');
  question: InputSignal<string> = input<string>('');
  additionalData: InputSignal<string> = input<string>('');
  cancellationText: InputSignal<string> = input<string>('Cancel');
  cancellationColor: InputSignal<string> = input<string>('btn-danger');
  cancellationIcon: InputSignal<string> = input<string>('bi-x-circle');
  confirmationText: InputSignal<string> = input<string>('Ok');
  confirmationColor: InputSignal<string> = input<string>('btn-success');
  confirmationIcon: InputSignal<string> = input<string>('bi-check2');

  getConfirmation: OutputEmitterRef<boolean> = output<boolean>()

  closeDialog() : void {
    this.getConfirmation.emit(false);
  }

  cancel() : void {
    this.getConfirmation.emit(false);
  }

  ok() : void {
    this.getConfirmation.emit(true);
  }

}