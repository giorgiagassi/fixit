import {Component, OnInit, ViewChild} from '@angular/core';
import {Table, TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {Router, RouterLink} from "@angular/router";
import {get, getDatabase, ref, remove} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {InputTextModule} from "primeng/inputtext";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-lista-utenti',
  standalone: true,
  imports: [
    TableModule,
    Button,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './lista-utenti.component.html',
  styleUrl: './lista-utenti.component.css'
})
export class ListaUtentiComponent implements OnInit{
  @ViewChild('dt1') dt1!: Table;

  utenti:any;
  loading: boolean = false
  constructor(private router: Router,

  ) {
  }
  ngOnInit(): void {
    this.getTipoList()
  }

  async getTipoList() {
    const huntersRef = ref(database, 'users');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.utenti = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista:', this.utenti);
        return this.utenti;
      } else {
        // La lista non è stata trovata nel database
        console.log('Nessuna lista trovata nel database.');
        return null;
      }
    } catch (error) {
      // Si è verificato un errore durante il recupero dei dati
      console.error('Errore durante il recupero della lista:', error);
      return null;
    }

  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `users/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.utenti = this.utenti.filter((item: any) => item.id !== customer.id);
      console.log('Eliminato con successo');
    }).catch((error:any) => {
      console.error('Errore durante l/eliminazione della comune:', error);
    });
  }

  addCustomer(customer: any) {

    this.router.navigate(['/modifica-utenti',  customer.id]);
  }

  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (this.dt1) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }
}
