import { ReviewsService } from './../review-service/reviews.service';
import { UserService } from './../user-service/user-service';
import { ILocal } from './../../utils/ILocal';
import { LocalsService } from './../local-service/locals.service';
import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";

import { ErrorStateMatcher } from "@angular/material";

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
  private localName:string;
  public stars:number = 1;
  public comment:string =  "";
  public isLoggedIn:boolean = false;
  constructor(private route :ActivatedRoute, private localsService:LocalsService,private userService:UserService, private reviewsService:ReviewsService) {
  }

  ngOnInit() {
      this.setLocal();
      this.isLoggedIn=this.userService.isLoggedIn();
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
      alert(err)
    });;
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
}