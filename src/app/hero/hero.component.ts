import { UserServiceService } from './../user-service/user-service.service';
import { MatDialog } from '@angular/material';
import { LogInComponent } from './../log-in/log-in.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  title = "Get Together";
  placeholder = "Cauta locul potrivit pentru tine si prietenii tai";
  jwtToken:string = null;
  constructor(private userService:UserServiceService,private router:Router) {}

  ngOnInit() {
    this.jwtToken = localStorage.getItem('token')
  }

  isLoggedIn():boolean{
    return this.jwtToken === null;
  }
  logout(){
    this.userService.logout();
    this.router.navigateByUrl('');
    this.jwtToken = null;
  }
}
