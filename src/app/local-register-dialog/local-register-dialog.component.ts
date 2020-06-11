import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalsService } from '../local-service/locals.service';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";


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
  selector: 'app-local-register-dialog',
  templateUrl: './local-register-dialog.component.html',
  styleUrls: ['./local-register-dialog.component.scss']
})
export class LocalRegisterDialogComponent implements OnInit {

  public localName:string = "";
  public localLocation:string = "";
  public localPhone:string = "";
  public localSpecifics:string[] = [];
  public localTags:string[] = [];
  public selectedImages: any[] = [];
  public allLocalTags: string [] = [];
  public allLocalSpecifics: string [] = [];

  constructor(
    public dialogRef: MatDialogRef<LocalRegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localsService: LocalsService,
    private errorSnackbar: MatSnackBar
    ) {}    

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

  selectImage($event){
    if($event.target.files){
      var reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onload = (event : any) => {
        this.selectedImages.push({
          id:null,
          imageUrl:event.target.result,
          imageFile:$event.target.files[0],
          removed:false})
      }
    }
  }

  removeImage(url){
    this.selectedImages = this.selectedImages.filter(image => image.imageUrl !== url);
  }

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

  async onSaveClick() {
    let local = {
      name: this.localName,
      location: this.localLocation,
      tags: this.localTags,
      specifics: this.localSpecifics,
      phone: this.localPhone,
    }
    
    let savedLocal;
    await this.localsService
      .saveLocal(local)
      .then(response => {
        savedLocal = response;
      })
      .catch(err=>{
        this.errorSnackbar.open(err.error, "Close", {
          duration: 2000,
          horizontalPosition: "center",
          verticalPosition: "top"
        })
      });


    this.selectedImages.forEach(image => {
      if(image.id === null){
        this.localsService.updateLocalImage(savedLocal.localId, image.imageFile)
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
    this.onCancelClick();
  }

  onCancelClick():void{
    this.dialogRef.close();
  }
}
