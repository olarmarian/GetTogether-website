import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms"; 
import { ErrorStateMatcher } from "@angular/material";
import { UserServiceService } from '../user-service/user-service.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent implements OnInit {
  public username:string =  "";
  public password:string =  "";
  public showMenu : boolean = true;
  private url : string = "https://us-central1-gettogether-55ba9.cloudfunctions.net/api/"

  constructor(private userService:UserServiceService,
              private router:Router){}
  ngOnInit(): void {
  }

  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();

  passwordFormControl = new FormControl("", [
    Validators.required,
  ]);

  public onResize($event){
    if($event.target.innerWidth > 800){
      this.showMenu = true;
    }
  }
  public submit() {
    this.userService.login(this.username,this.password).subscribe(jwtToken=>{
      this.userService.setSession(jwtToken['token']);
      this.router.navigateByUrl('/');
    })
  }

  public usernameChange($event) {
    this.username = $event;
  }

  public passwordChange($event) {
    this.password = $event;
  }
}
