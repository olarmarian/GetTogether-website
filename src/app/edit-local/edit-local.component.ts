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
  public ignoredImagesUrl: string[] = [];
  public imagesUrlObjects:any[] = [];

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
        this.local = response;
        this.localName = this.local.name;
        this.localPhone = this.local.phone;
        this.localLocation = this.local.location;
        this.localSpecifics = this.local.specific;
        this.localTags = this.local.tags;
        this.imagesUrlObjects = this.local.imagesUrl.map(image => {
          return {id:image.id, imageUrl: image.imageUrl, removed:false}
        });
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

  addToLocalSpecifics(checked, $event){
    let newSpecific = $event.source.value;
    
    if(checked){
      this.localSpecifics.push(newSpecific);
    }else{
      this.localSpecifics = this.localSpecifics.filter(specific => specific !== newSpecific)
    }
  }

  addToLocalTags(checked, $event){
    let newTag = $event.source.value;

    if(checked){
      this.localTags.push(newTag);
    }else{
      this.localTags = this.localTags.filter(tag => tag !== newTag)
    }
  }

  selectImage($event){
    if($event.target.files){
      var reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onload = (event : any) => {
        this.imagesUrlObjects.push({
          id:null, 
          imageUrl:event.target.result, 
          imageFile:$event.target.files[0], 
          removed:false})
      }
    }
  }

  addImage(url){
    this.imagesUrlObjects = this.imagesUrlObjects.map(obj => {
      if(obj.imageUrl === url){
        obj.removed = false;
      }
      return obj;
    })

    console.log(this.imagesUrlObjects)
  }

  removeImage(url){
    this.imagesUrlObjects = this.imagesUrlObjects.map(obj => {
      if(obj.imageUrl === url){
        obj.removed = true;
      }
      return obj;
    })

    console.log(this.imagesUrlObjects)
  }

  onUpdateClick(){
    const localImages = this.imagesUrlObjects;
    
    const newLocal:ILocal = {
      localId: this.local.localId,
      name: this.localName,
      searchName: this.localName.replace(" ","-").toLowerCase(),
      location: this.localLocation,
      specific: this.localSpecifics,
      tags: this.localTags,
      phone: this.localPhone,
      userEmail: this.local.userEmail,
      imagesUrl: []
    }

    this.localsService.updateLocal(newLocal)
      .catch(err => {
        this.errorSnackbar.open(err.error, "Close", {
          duration: 2000,
          horizontalPosition: "center",
          verticalPosition: "top"
        })
      })
    localImages.forEach(image => {
      if(image.id === null){
        this.localsService.updateLocalImage(this.local.localId, image.imageFile)
          .catch(err => {
            this.errorSnackbar.open(err.error, "Close", {
              duration: 2000,
              horizontalPosition: "center",
              verticalPosition: "top"
            })
          })
      }else{
        if(image.removed){
          this.localsService.removeLocalImage(image.id)
            .catch(err =>{
              this.errorSnackbar.open(err.error, "Close", {
                duration: 2000,
                horizontalPosition: "center",
                verticalPosition: "top"
              })
            })
        }
      }
    })
  }

  onCancelClick(){
    window.location.assign(`/locals/${this.name}`);
  }
}
