import {Component, OnInit} from '@angular/core';
import {TicketService} from "../../../providers/ticket.service";
import {TicketType} from "../../../types/ticket.type";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../providers/auth.service";


@Component({
  selector: 'app-crea-ticket',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './crea-ticket.component.html',
  styleUrl: './crea-ticket.component.css'
})
export class CreaTicketComponent implements OnInit{
  ticket: Omit<TicketType, 'cron'> = {
    oggetto: '',
    testo: '',
    urgenza: 'Media',
    tipologia: 'PC',
    utente: '',
    dataCreazione:'',
    Stato: 'Aperto'
  };

  constructor(private ticketService: TicketService,
              private authService: AuthService) {}

  createTicket() {
    this.ticketService.createTicket(this.ticket).then(() => {
      console.log('Ticket creato con successo');
    }).catch((error) => {
      console.error('Errore nella creazione del ticket', error);
    });
  }
  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.ticket.utente = `${userDetails.name} ${userDetails.surname}`;
    }
  }

  ngOnInit(): void {
    this.loadUserDetails();
    // Formatta la data in dd-mm-yyyy
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // I mesi in JavaScript sono 0-indexed
    const year = today.getFullYear();

    this.ticket.dataCreazione = `${day}-${month}-${year}`;
  }
}
