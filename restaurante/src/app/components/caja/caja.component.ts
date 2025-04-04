import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DOCUMENT } from '@angular/common';
import { Empleado } from '../../models/empleado.model';
import { CajasService } from '../../services/cajas.service';
import { Caja } from '../../models/caja.model';

@Component({
  selector: 'app-caja',
  imports: [MatCardModule, ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule ],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})
export class CajaComponent {
  caja: Caja | null = null;
  CajaForm: FormGroup;
  codigoEmpleado: number = 0;

  constructor(public srvCajas: CajasService, private fb: FormBuilder, @Inject(DOCUMENT) private document: Document){

    const localStorage = document.defaultView?.localStorage;
    const empleado : Empleado = JSON.parse(localStorage?.getItem('empleado') || '{}');
    this.codigoEmpleado = empleado.id;

    srvCajas.getCajas().subscribe(x=>{
      this.caja = x.find(caja=> caja.hora_fin == null) ?? null;
    });

    this.CajaForm = this.fb.group({
      saldo: ['', [Validators.required, Validators.min(0)]],
    });
  }

  abrirCaja() {
    if (this.CajaForm.valid) {
      this.srvCajas.abrirCaja(
        this.codigoEmpleado,
        this.CajaForm.value.saldo
      ).subscribe(response => {
        alert(response.message);
      });
    }
  }

  cerrarCaja() {
    if (this.CajaForm.valid && this.caja) {
      this.srvCajas.cerrarCaja(
        this.caja.id,
        this.CajaForm.value.saldo
      ).subscribe(response => {
        alert(response.message);
      });
    }
  }

  onSubmit(){
    if(this.caja){
      this.cerrarCaja();
    }else{
      this.abrirCaja();
    }
  }
}
