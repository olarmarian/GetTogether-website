import { UserServiceService } from './../user-service/user-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router, private userService:UserServiceService) { }

  isLoggedIn():boolean{
    return localStorage.getItem('token') !== null;
  }
  logout(){
    this.userService.logout();
    this.router.navigateByUrl('');
  }
  ngOnInit() {
  }

}
