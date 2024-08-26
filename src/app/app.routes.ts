import {mapToCanActivate, Routes} from '@angular/router';
import {LoginComponent} from "./pages/utenti/login/login.component";
import {ListaTicketComponent} from "./pages/ticket/lista-ticket/lista-ticket.component";
import {HomeComponent} from "./pages/home/home.component";
import {CreaTicketComponent} from "./pages/ticket/crea-ticket/crea-ticket.component";
import {AuthGuard} from "./providers/auth.guard";
import {CreaUtenteComponent} from "./pages/utenti/crea-utente/crea-utente.component";
import {ModificaUtenteComponent} from "./pages/utenti/modifica-utente/modifica-utente.component";
import {ListaUtentiComponent} from "./pages/utenti/lista-utenti/lista-utenti.component";

export const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: mapToCanActivate([AuthGuard])},
  {path:'lista-ticket', component: ListaTicketComponent, canActivate: mapToCanActivate([AuthGuard])},
  {path:'crea-ticket', component: CreaTicketComponent, canActivate: mapToCanActivate([AuthGuard])},
  {path:'crea-utente', component:CreaUtenteComponent, canActivate: mapToCanActivate([AuthGuard])},
  {path:'modifica-utenti/:id', component:ModificaUtenteComponent, canActivate: mapToCanActivate([AuthGuard])},
  {path:'lista-utenti', component:ListaUtentiComponent, canActivate: mapToCanActivate([AuthGuard])},
];
