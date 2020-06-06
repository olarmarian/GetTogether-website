import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { LocalsService } from '../local-service/locals.service';


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
  selector: 'app-edit-local',
  templateUrl: './edit-local.component.html',
  styleUrls: ['./edit-local.component.scss']
})
export class EditLocalComponent implements OnInit {
  public localName:string = "";
  public localLocation:string = "";
  public localPhone:string = "";
  public localSpecifics:string[] = [];
  public localTags:string[] = [];
  public imagesUrl:string[] = [];

  public allLocalTags: string [] = [];
  public allLocalSpecifics: string [] = [];

 
  constructor(private localsService:LocalsService) { }

  ngOnInit() {
    this.localsService.getAllLocalSpecifics().then(specifics => {
      this.allLocalSpecifics = specifics;
    });

    this.localsService.getAllLocalTags().then(tags => {
      this.allLocalTags = tags;
    });
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
