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
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
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
    DialogModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './lista-ticket.component.html',
  styleUrl: './lista-ticket.component.css'
})
export class ListaTicketComponent implements OnInit{
  @ViewChild('dt1') dt1!: Table;

  ticket:any;
  loading: boolean = false;
  currentUser: string = '';
  currentUserID: string = '';
  role: string = '';
  visible: boolean = false;
  selectedTicket: any = null;
  operators: any[] = [];
  selectedOperator: string = '';
  assignDialogVisible: boolean = false;
  filterMyTickets: boolean = false;
  filteredTickets: any;
  constructor(private router: Router,
              private authService: AuthService

  ) {
  }
  ngOnInit(): void {
    this.getTipoList();
    this.loadUserDetails();
    this.getOperatorsList();
  }

  async getTipoList() {
    const huntersRef = ref(database, 'tickets');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        let allTickets = Object.keys(snapshot.val()).map(key => ({ ...snapshot.val()[key], id: key }));
        if (this.role === 'user') {
          allTickets = allTickets.filter(ticket => ticket.utente === this.currentUser);
        }

        this.ticket = allTickets.reverse();
        console.log('Lista ordinata per ordine di creazione:', this.ticket);
        return this.ticket;
      } else {
        console.log('Nessuna lista trovata nel database.');
        return null;
      }
    } catch (error) {
      console.error('Errore durante il recupero della lista:', error);
      return null;
    }
  }


  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.currentUser = `${userDetails.name} ${userDetails.surname}`;
      this.role = userDetails.role;
      this.currentUserID = userDetails.id;
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
  async salvaNotaLavorazione(ticketId: string) {
    if (this.selectedTicket && this.selectedTicket.notaLavorazione) {
      const updates = {
        notaLavorazione: this.selectedTicket.notaLavorazione
      };
      try {
        await update(ref(database, `tickets/${ticketId}`), updates);
        this.getTipoList(); // Ricarica la lista dopo l'aggiornamento
        console.log('Nota di lavorazione aggiornata');
        this.visible = false; // Chiudi il dialogo dopo il salvataggio
      } catch (error) {
        console.error('Errore durante l\'aggiornamento della nota di lavorazione:', error);
      }
    }
  }


  async getOperatorsList() {
    const usersRef = ref(database, 'users'); // Assumi che gli utenti siano salvati sotto 'users'
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.operators = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })).filter(user => user.role === 'operatore'); // Filtra per ruolo "operatore"
      } else {
        console.log('Nessun operatore trovato.');
      }
    } catch (error) {
      console.error('Errore durante il recupero degli operatori:', error);
    }
  }

  async assignTicket() {
    if (this.selectedOperator && this.selectedTicket) {
      const updates = {
        assignedTo: this.selectedOperator, // Salva l'operatore selezionato
      };
      try {
        await update(ref(database, `tickets/${this.selectedTicket.id}`), updates);
        this.getTipoList(); // Ricarica la lista dopo l'aggiornamento
        console.log('Ticket assegnato a:', this.selectedOperator);
        this.assignDialogVisible = false; // Chiudi il dialog
      } catch (error) {
        console.error('Errore durante l\'assegnazione del ticket:', error);
      }
    }
  }

  showAssignDialog(ticket: any) {
    this.selectedTicket = ticket;
    this.assignDialogVisible = true;
  }
  async applyFilterOperatore() {
    const huntersRef = ref(database, 'tickets');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        let allTickets = Object.keys(snapshot.val()).map(key => ({...snapshot.val()[key], id: key}));

        // Filtro per operatore
        if (this.role === 'operatore') {
          allTickets = allTickets.filter(ticket => ticket.assignedTo && ticket.assignedTo.id === this.currentUserID);
        }

        this.ticket = allTickets.reverse();
        console.log('Lista ordinata per ordine di creazione:', this.ticket);
        return this.ticket;
      } else {
        console.log('Nessuna lista trovata nel database.');
        return null;
      }
    } catch (error) {
      console.error('Errore durante il recupero della lista:', error);
      return null;
    }
  }
  toggleMyTicketsFilter() {
    this.filterMyTickets = !this.filterMyTickets;
    this.applyFilterOperatore();
  }
  async applyFilterOperatoreCreati() {
    const huntersRef = ref(database, 'tickets');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        let allTickets = Object.keys(snapshot.val()).map(key => ({...snapshot.val()[key], id: key}));

        // Filtro per operatore
        if (this.role === 'operatore') {
          allTickets = allTickets.filter(ticket => ticket.utente === this.currentUser);
        }

        this.ticket = allTickets.reverse();
        console.log('Lista ordinata per ordine di creazione:', this.ticket);
        return this.ticket;
      } else {
        console.log('Nessuna lista trovata nel database.');
        return null;
      }
    } catch (error) {
      console.error('Errore durante il recupero della lista:', error);
      return null;
    }
  }

  toggleMyTicketsFilterCreati() {

    this.applyFilterOperatoreCreati();
  }
}
