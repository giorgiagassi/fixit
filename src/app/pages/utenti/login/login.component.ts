import { Component } from '@angular/core';
import {AuthService} from "../../../providers/auth.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public  loading: boolean = false;
  constructor(public authService: AuthService) {
  }

  accedi(email: string, password: string) {
    this.authService.SignIn(email, password)
      .then(() => {
        // Login completato con successo

      })
      .catch((error) => {
        // Gestire gli errori qui, se necessario

        this.loading = false; // Assicurati che lo spinner sia disattivato anche in caso di errore
      });

  }
}
