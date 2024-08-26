import {Injectable} from '@angular/core';
import {get, getDatabase, push, ref, set} from 'firebase/database';
import Swal from "sweetalert2";
import {TicketType} from "../types/ticket.type";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private db = getDatabase();

  constructor() {}

  async createTicket(ticket: Omit<TicketType, 'cron'>): Promise<void> {
    try {
      const ticketId = await this.generateTicketId();
      const ticketWithId = { ...ticket, cron: ticketId };

      const ticketRef = push(ref(this.db, 'tickets'));
      await set(ticketRef, ticketWithId);

      Swal.fire({
        icon: 'success',
        title: 'Ticket Creato',
        text: `Il ticket è stato creato con ID: ${ticketId}`,
      });
    } catch (error) {
      console.error('Errore durante la creazione del ticket: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: 'C\'è stato un errore nella creazione del ticket. Per favore riprova.',
      });
    }
  }

  private async generateTicketId(): Promise<string> {
    try {
      const year = new Date().getFullYear();
      const ticketsRef = ref(this.db, 'tickets');

      const snapshot = await get(ticketsRef);
      const tickets = snapshot.val();

      let count = 0;

      if (tickets) {
        const ticketKeys = Object.keys(tickets);
        count = ticketKeys.length; // Numero di ticket esistenti
      }


       // Genera l'ID in formato "1/2024"
      return `${count + 1}/${year}`;
    } catch (error) {
      console.error('Errore durante la generazione dell\'ID del ticket: ', error);
      await Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: 'C\'è stato un errore nella generazione dell\'ID del ticket. Per favore riprova.',
      });
      throw error; // Rilancia l'errore per gestirlo a livello superiore
    }
  }
}
