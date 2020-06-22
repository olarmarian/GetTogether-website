import { UserService } from './../user-service/user-service';
import { Component, OnInit } from '@angular/core';
import { FormGroupDirective, FormControl, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      control.dirty
    );
  }
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public phone:string = "";
  public name:string = "";
  public email:string = "";
  public userId: string = "";

  public user: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private errorSnackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    if(this.userService.isLoggedIn()){
      this.userId = sessionStorage.getItem("userId");
      this.userService.getAccount(this.userId)
        .then(response => {
          this.user = response;
        })
        .catch(err => {
          this.errorSnackbar.open(err.error, "Close", {
            duration: 2000,
            verticalPosition: "top",
            horizontalPosition: "center"
          })
        })
    }
  }

  nameFormControl = new FormControl("", [
    Validators.required,
  ]);
  phoneFormControl = new FormControl("", [
    Validators.required
  ]);
  locationFormControl = new FormControl("", [
    Validators.required,
  ]);
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  matcher = new FormErrorStateMatcher();

  phoneChange($event){
    this.user.phone = $event;
  }

  nameChange($event){
    this.user.name = $event;
  }

  emailChange($event){
    this.user.email = $event;
  }

  async onUpdateClick(){
    this.user.id = this.userId;
    await this.userService.updateProfile(this.user)
      .then(() => {
        this.router.navigateByUrl(`/account/${this.userId}`)
      })
      .catch(err => {
        this.errorSnackbar.open(err.error, "Close", {
          duration: 2000,
          horizontalPosition: "center",
          verticalPosition: "top"
        })
      })
  }

  onCancelClick(){
    this.router.navigateByUrl(`/account/${this.userId}`)
  }
}
