import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-login',
  imports: [MatCardModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userName: string = '';
  password: string = '';

  constructor(public srvAuth : AuthService) {}

  public onLogin(){
    this.srvAuth.onLogin(this.userName, this.password);
  }
}
