import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {AuthService} from "../../../providers/auth.service";

@Component({
  selector: 'app-crea-utente',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './crea-utente.component.html',
  styleUrl: './crea-utente.component.css'
})
export class CreaUtenteComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  loading: boolean = false;
  constructor(private authService: AuthService) {}

  async onRegister() {
    this.loading= true
    if (!this.name || !this.surname || !this.email || !this.password || !this.role) {
      Swal.fire({  // Utilizza Swal per un feedback visivo
        icon: 'error',
        text: 'Per favore, completa tutti i campi.'
      });
      return;
    }

    try {
      await this.authService.createUser(this.name, this.surname, this.email, this.password, this.role,);

    } catch (error) {
      console.error("Errore durante la registrazione", error);
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
    }finally {
      this.loading = false;
    }
  }
}
