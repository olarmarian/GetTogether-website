import { UserService } from './../user-service/user-service';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";

import { ErrorStateMatcher } from "@angular/material";

export class FormErrorStateMatcher implements ErrorStateMatcher {
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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private userService:UserService,private router:Router) { }

  public name:string =  "";
  public phone:string =  "";
  public email:string =  "";
  public password:string =  "";
  public confirmedPassword:string =  "";
  public showMenu : boolean = true;
  public arePasswordsEqual:boolean = false;

  nameFormControl = new FormControl("", [
    Validators.required,
  ]);
  phoneFormControl = new FormControl("", [
    Validators.required
  ]);
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  matcher = new FormErrorStateMatcher();

  passwordFormControl = new FormControl("", [
    Validators.required,
  ]);
  confirmedPasswordFormControl = new FormControl("", [
    Validators.required,
  ]);

  public areBothPasswordsEqual(){
    this.arePasswordsEqual = (this.password === this.confirmedPassword);
  }
  public onResize($event){
    if($event.target.innerWidth > 800){
      this.showMenu = true;
    }
  }
  public submit() {
    this.userService.signUp(this.name,this.phone,this.email,this.password,this.confirmedPassword)
      .then(responseJson => {
        return responseJson.json();
      })
      .then(response=>{
        if(response['token']!==undefined){
          this.userService.setSession(response['token'],response['userId'])
          this.router.navigateByUrl('/');
        }
      })
      .catch(err => {
        alert(err.error)
      })
  }

  public nameChange($event) {
    this.name = $event;
  }

  public phoneChange($event) {
    this.phone = $event;
  }
  public emailChange($event) {
    this.email = $event;
  }
  public passwordChange($event) {
    this.password = $event;
  }

  public confirmedPasswordChange($event) {
    this.confirmedPassword = $event;
    this.areBothPasswordsEqual();
  }
  ngOnInit() {
  }

}