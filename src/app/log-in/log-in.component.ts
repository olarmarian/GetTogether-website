import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms"; 
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { UserService } from '../user-service/user-service';



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
  styleUrls: ['./log-in.component.scss']
})

export class LogInComponent implements OnInit {
  public username:string =  "";
  public password:string =  "";
  public showMenu : boolean = true;

  constructor(private userService:UserService,
              private router:Router,
              private errorSnackbar: MatSnackBar,
              private invalidEmailSnackbar: MatSnackBar,
              private invalidPasswordSnackbar: MatSnackBar){}
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
    this.userService.login(this.username,this.password).subscribe(
      response=>{
        this.userService.setSession(response['token'],response['userId']);
        this.router.navigateByUrl('/');
      },
      error => {
        if(error.error.hasOwnProperty("error")){
          this.errorSnackbar.open(error.error.error, "Close", {
            duration:2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ["red-snackbar"]
          });
        }else{
          setTimeout(() => {
            this.invalidPasswordSnackbar.open("Password : " + error.error.password, "Close", {
              duration:2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ["red-snackbar"]
            });  
          }, 2000 + 500);
          this.invalidEmailSnackbar.open("Email : " + error.error.email, "Close", {
            duration:2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ["red-snackbar"]
          });
          
        }
      })
  }

  public usernameChange($event) {
    this.username = $event;
  }

  public passwordChange($event) {
    this.password = $event;
  }
}
