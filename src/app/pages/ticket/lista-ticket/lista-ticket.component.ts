import {Component, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {Router, RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {get, getDatabase, ref, update} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {TagModule} from "primeng/tag";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../providers/auth.service";
import {DialogModule} from "primeng/dialog";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-lista-ticket',
  standalone: true,
  imports: [
    Button,
    InputTextModule,
    PrimeTemplate,
    RouterLink,
    TableModule,
    TagModule,
    NgIf,
    DialogModule
  ],
  templateUrl: './lista-ticket.component.html',
  styleUrl: './lista-ticket.component.css'
})
export class ListaTicketComponent implements OnInit{
  @ViewChild('dt1') dt1!: Table;

  ticket:any;
  loading: boolean = false;
  currentUser: string = '';
  visible: boolean = false;
  selectedTicket: any = null;
  constructor(private router: Router,
              private authService: AuthService

  ) {
  }
  ngOnInit(): void {
    this.getTipoList();
    this.loadUserDetails();
  }

  async getTipoList() {
    const huntersRef = ref(database, 'tickets');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.ticket = Object.keys(data).map(key => ({ ...data[key], id: key }));

        // Inverti l'array per mostrare dal più recente al meno recente
        this.ticket.reverse();

        console.log('Lista ordinata per ordine di creazione:', this.ticket);
        return this.ticket;
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

  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.currentUser = `${userDetails.name} ${userDetails.surname}`;
    }
  }


  async lavoraTicket(ticketId: string) {
    if (this.currentUser) {
      const updates = {
        dataLavorazione: this.formatDateToDDMMYYYY(new Date()), // Formatta la data
        utenteLavorazione: this.currentUser,
        Stato: 'In Lavorazione'
      };
      try {
        await update(ref(database, `tickets/${ticketId}`), updates);
        this.getTipoList(); // Ricarica la lista dopo l'aggiornamento
        console.log('Ticket aggiornato in "In Lavorazione"');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento del ticket:', error);
      }
    } else {
      console.error('Nessun utente loggato');
    }
  }

  async terminaTicket(ticketId: string) {
    if (this.currentUser) {
      const updates = {
        dataChiusura: this.formatDateToDDMMYYYY(new Date()), // Formatta la data
        utenteChiusura: this.currentUser,
        Stato: 'Chiuso'
      };
      try {
        await update(ref(database, `tickets/${ticketId}`), updates);
        this.getTipoList(); // Ricarica la lista dopo l'aggiornamento
        console.log('Ticket aggiornato in "Chiuso"');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento del ticket:', error);
      }
    } else {
      console.error('Nessun utente loggato');
    }
  }
  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (this.dt1) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }
  showDialog(ticket: any) {
    this.selectedTicket = ticket;
    this.visible = true;
  }
}
