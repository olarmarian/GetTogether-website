import { UserService } from './../user-service/user-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  title = "Get Together";
  subtitle = "Call your friends and hang out in one of ours best restaurants";
  userId:string = null;
  constructor(private userService:UserService,private router:Router) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId')
  }

  isLoggedIn():boolean{
    return this.userId === null;
  }
  logout(){
    this.userService.logout();
    this.router.navigateByUrl('');
    this.userId = null;
  }
}
