import { ReviewsService } from './../review-service/reviews.service';
import { UserService } from './../user-service/user-service';
import { ILocal } from './../../utils/ILocal';
import { LocalsService } from './../local-service/locals.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";

import { ErrorStateMatcher, MatSnackBar } from "@angular/material";

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
  selector: 'app-local-details',
  templateUrl: './local-details.component.html',
  styleUrls: ['./local-details.component.css']
})
export class LocalDetailsComponent implements OnInit {

  public local:ILocal = null;
  public localName:string;
  public stars:number = 1;
  public comment:string = "";
  public isLoggedIn:boolean = false;
  public userEmail:string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private localsService: LocalsService,
    private userService: UserService, 
    private reviewsService: ReviewsService,
    private errorSnackbar: MatSnackBar) {
  }

  async ngOnInit() {
      await this.setLocal();
      this.isLoggedIn=this.userService.isLoggedIn();
      await this.userService.getAccount(sessionStorage.getItem("userId"))
        .then(response =>{
          this.userEmail = response.email;
        })
        .catch(err=>{
          console.log(err)
          this.errorSnackbar.open(err.error, "Close", {
            duration:2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ["red-snackbar"]
          })
        })
  }

  matcher = new MyErrorStateMatcher();

  commentFormControl = new FormControl("");

  starsFormControl = new FormControl(1, [
    Validators.required,
    Validators.max(5),
    Validators.min(1)
  ]);

  

  public submit() {
    this.reviewsService.addReview(this.local.localId,this.comment,this.stars)
    .then(()=>{
      this.stars=1;
      this.comment="";
      this.commentFormControl.setValue("");
      this.starsFormControl.setValue(1);
    })
    .catch((err) => {
      this.errorSnackbar.open(err.error, "Close", {
        duration:2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ["red-snackbar"]
      })
    });
  }

  public commentChange($event) {
    this.comment = $event;
  }

  public starsChange($event) {
    this.stars = $event;
  }

  async setLocal(){
    this.route.paramMap.subscribe(params => {
      this.localName = params.get('name');
      })
    this.local = await this.localsService.getLocalByName(this.localName);
  }

  gotoEditLocalPage(){
    this.router.navigate(["edit"], {relativeTo: this.route});
  }
}