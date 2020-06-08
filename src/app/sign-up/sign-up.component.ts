import { UserService } from './../user-service/user-service';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { MatSnackBar } from '@angular/material';
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

  constructor(
    private userService:UserService,
    private router:Router,
    private errorSnackbar: MatSnackBar,
    private invalidEmailSnackbar: MatSnackBar,
    private invalidPasswordSnackbar: MatSnackBar) { }

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
      .then(response=>{
        if(response['token']!==undefined){
          this.userService.setSession(response['token'],response['userId'])
          this.router.navigateByUrl('/');
        }else{
          setTimeout(() => {
            if(response.error.phone){
              this.invalidPasswordSnackbar.open(response.error.phone, "Close", {
                duration:2000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ["red-snackbar"]
              });  
            }
          }, 2000 + 3000);
            
          setTimeout(() => {
            if(response.error.name){
              this.invalidPasswordSnackbar.open(response.error.name, "Close", {
                duration:2000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ["red-snackbar"]
              });  
            }
          }, 2000 + 2000);

          setTimeout(() => {
            if(response.error.password){
              this.invalidPasswordSnackbar.open(response.error.password, "Close", {
                duration:2000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ["red-snackbar"]
              });  
            }
          }, 2000 + 1000);


          if(response.error.email){
            this.invalidEmailSnackbar.open(response.error.email, "Close", {
              duration:2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ["red-snackbar"]
            });
          }
          
          if(response.error){
            this.errorSnackbar.open(response.error, "Close", {
              duration:2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ["red-snackbar"]
            })
          }
        }
      })
      .catch(error => {
        if(error.hasOwnProperty("error")){
          this.errorSnackbar.open(error.error, "Close", {
            duration:2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ["red-snackbar"]
          });
        }
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
