import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ILocal } from 'src/utils/ILocal';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { LocalsService } from '../local-service/locals.service';
import { Route } from '@angular/compiler/src/core';


export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-edit-local',
  templateUrl: './edit-local.component.html',
  styleUrls: ['./edit-local.component.scss']
})
export class EditLocalComponent implements OnInit {
  public name: string;
  public localName:string = "";
  public localLocation:string = "";
  public localPhone:string = "";
  public localSpecifics:string[] = [];
  public localTags:string[] = [];
  public imagesUrl:string[] = [];

  public allLocalTags: string [] = [];
  public allLocalSpecifics: string [] = [];
  public local:ILocal = null;
 
  constructor(
    private localsService:LocalsService,
    private activatedRoute: ActivatedRoute,
    private errorSnackbar: MatSnackBar) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.name = params["name"])
    
    this.localsService.getAllLocalSpecifics().then(specifics => {
      this.allLocalSpecifics = specifics;
    });

    this.localsService.getAllLocalTags().then(tags => {
      this.allLocalTags = tags;
    });

    this.localsService.getLocalByName(this.name)
      .then(response => {
        console.log(response)
        this.local = response;
        this.localName = this.local.name;
        this.localPhone = this.local.phone;
        this.localLocation = this.local.location
      })
      .catch(err=>{
        this.errorSnackbar.open(err.error, "Close", {
          duration: 2000,
          horizontalPosition: "center",
          verticalPosition: 'top'
        })
      })
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
  matcher = new FormErrorStateMatcher();

  phoneChange($event){
    this.localPhone = $event;
  }

  locationChange($event){
    this.localLocation = $event;
  }

  nameChange($event){
    this.localName = $event;
  }

  addToLocalSpecifics($event){
    this.localSpecifics.push($event.source.value);
  }

  addToLocalTags($event){
    this.localTags.push($event.source.value);
  }

  selectImage($event){
    if($event.target.files){
      var reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onload = (event : any) => {
        this.imagesUrl.push(event.target.result)
      }
    }
  }

}
