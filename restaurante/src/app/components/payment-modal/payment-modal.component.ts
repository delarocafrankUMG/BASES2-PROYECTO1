import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-modal',
  imports: [MatDialogModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectPayment(method: string) {
    this.dialogRef.close(method); // Devuelve el método seleccionado
  }
}
