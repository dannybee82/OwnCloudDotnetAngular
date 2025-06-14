import { Component, InputSignal, input, OutputEmitterRef, output} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  readonly title: InputSignal<string> = input<string>('');
  readonly question: InputSignal<string> = input<string>('');
  readonly additionalData: InputSignal<string> = input<string>('');
  readonly cancellationText: InputSignal<string> = input<string>('Cancel');
  readonly cancellationColor: InputSignal<string> = input<string>('btn-danger');
  readonly cancellationIcon: InputSignal<string> = input<string>('bi-x-circle');
  readonly confirmationText: InputSignal<string> = input<string>('Ok');
  readonly confirmationColor: InputSignal<string> = input<string>('btn-success');
  readonly confirmationIcon: InputSignal<string> = input<string>('bi-check2');

  readonly getConfirmation: OutputEmitterRef<boolean> = output<boolean>()

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