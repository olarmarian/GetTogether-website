import { UserService } from './../user-service/user-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userId:string;
  constructor(private router:Router, private userService:UserService) { }

  isLoggedIn():boolean{
    return this.userId !== null;
  }
  logout(){
    this.userService.logout();
    this.router.navigateByUrl('');
  }
  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
  }

}
