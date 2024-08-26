import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../providers/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  role: string = '';
  constructor(public authService: AuthService) {
  }
  logout(){
    this.authService.SignOut()
  }
  ngOnInit() {
    this.loadUserDetails();
  }
  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.role = userDetails.role
    }
  }
}
