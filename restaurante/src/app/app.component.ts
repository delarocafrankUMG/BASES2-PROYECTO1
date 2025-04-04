import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraComponent } from "./components/barra/barra.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'restaurante';
}
