import { BehaviorSubject } from 'rxjs';
import { TableActionDialogComponent } from './../table-action-dialog/table-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationsService } from './../reservations-service/reservations.service';
import { ReviewsService } from "./../review-service/reviews.service";
import { UserService } from "./../user-service/user-service";
import { ILocal } from "./../../utils/ILocal";
import { LocalsService } from "./../local-service/locals.service";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
  FormBuilder,
  FormGroup,
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
  selector: "app-local-details",
  templateUrl: "./local-details.component.html",
  styleUrls: ["./local-details.component.css"],
})
export class LocalDetailsComponent implements OnInit {
  public local: ILocal = null;

  public localsReservations = new BehaviorSubject<any[]>([]);
  public localsReservationsPage: any[] = [];
  public localName: string;
  public stars: number = 1;
  public comment: string = "";
  public isLoggedIn: boolean = false;
  public userEmail: string = "";
  public dateFormGroup: FormGroup;
  public hourFormGroup: FormGroup;
  public seatsFormGroup: FormGroup;
  public totalReservations: number;

  startIndex: number = 0;
  endIndex: number = 5;
  chunkOfReviews: number = 5;
  limitPage:number = 5;
  displayedColumns: string[] = ["userName", "date", "hour", "seats", "status", "actions"]
  isLinear = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localsService: LocalsService,
    private userService: UserService,
    private reservationsService: ReservationsService,
    private reviewsService: ReviewsService,
    private addReservationFormBuilder: FormBuilder,
    private errorSnackbar: MatSnackBar,
    private editDialog: MatDialog
  ) {}

  async ngOnInit() {

    this.dateFormGroup = this.addReservationFormBuilder.group({
      dateCtrl: ['', Validators.required]
    })
    this.hourFormGroup = this.addReservationFormBuilder.group({
      hourCtrl: ['', Validators.required]
    })
    this.seatsFormGroup = this.addReservationFormBuilder.group({
      seatsCtrl: ['', Validators.required]
    })
    await this.setLocal();
    this.isLoggedIn = this.userService.isLoggedIn();
    
    await this.userService
      .getAccount(sessionStorage.getItem("userId"))
      .then((response) => {
        this.userEmail = response.email;
      })
      .catch(() => {});

    if(this.userEmail === this.local.userEmail)
      await this.fetchReservations();
  }

  async fetchReservations(){
    await this.reservationsService
    .getLocalsReservations(this.local.localId)
    .then(response =>{
      
      this.startIndex = 0;
      this.endIndex = this.limitPage;

      this.localsReservations.next(response);
      
    })
    .then(() => {
      this.localsReservations.subscribe(res =>{
        this.totalReservations = res.length;
        this.localsReservationsPage = res.slice(this.startIndex, this.endIndex);
      });
    })
    .catch(() => {
      this.errorSnackbar.open("Something went wrong", "Close", {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
        panelClass: ["red-snackbar"],
      });
    })
  }

  matcher = new MyErrorStateMatcher();

  commentFormControl = new FormControl("");

  starsFormControl = new FormControl(1, [
    Validators.required,
    Validators.max(5),
    Validators.min(1),
  ]);

  public submit() {
    this.reviewsService
      .addReview(this.local.localId, this.comment, this.stars)
      .then(() => {
        this.stars = 1;
        this.comment = "";
        this.commentFormControl.setValue("");
        this.starsFormControl.setValue(1);
      })
      .catch(() => {
        this.errorSnackbar.open("Something went wrong", "Close", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "center",
          panelClass: ["red-snackbar"],
        });
      });
  }

  public commentChange($event) {
    this.comment = $event;
  }

  public starsChange($event) {
    this.stars = $event;
  }

  async setLocal() {
    this.route.paramMap.subscribe((params) => {
      this.localName = params.get("name");
    });
    this.local = await this.localsService.getLocalByName(this.localName);
  }

  gotoEditLocalPage() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  saveReservation(){
    const userId = sessionStorage.getItem("userId");
    const date = new Date(this.dateFormGroup.get("dateCtrl").value).toLocaleDateString();
    const hour = this.hourFormGroup.get("hourCtrl").value;
    const seats = this.seatsFormGroup.get("seatsCtrl").value;
    
    if(userId != null){
      const reservation = {
        userId: userId,
        localId: this.local.localId,
        createdAt: new Date().toLocaleDateString(),
        hour: hour,
        date: date,
        seats: seats,
        status: "ACTIVE"
      }
      this.reservationsService.saveReservation(reservation)
        .then((response) => {
          this.errorSnackbar.open(response.message, "Close", {
            duration: 2000,
            verticalPosition: "top",
            horizontalPosition: "center"
          })
          this.dateFormGroup.get("dateCtrl").setValue("");
          this.hourFormGroup.get("hourCtrl").setValue("");
          this.seatsFormGroup.get("seatsCtrl").setValue("");    
        })
        .catch(() => {
          this.errorSnackbar.open("Something went wrong", "Close", {
            duration: 2000,
            verticalPosition: "top",
            horizontalPosition: "center"
          })
        })
    }else {
      sessionStorage.clear();
      window.location.assign("/login")
    }
  }

  onPageChanged(event){
    const prevPageIndex = event.previousPageIndex;
    const pageIndex = event.pageIndex;
    
    if(prevPageIndex < pageIndex){
      this.startIndex = this.endIndex;
      let noReservations = 0;
      this.localsReservations.subscribe(res => {
        noReservations = res.length;
      })
      if(this.endIndex + this.chunkOfReviews > noReservations){
        this.localsReservations.subscribe(res=> {this.endIndex = res.length});
      }else{
        this.endIndex + this.chunkOfReviews;
      }
    }
    else if(prevPageIndex > pageIndex){
      this.endIndex = this.startIndex;
      this.startIndex -= this.chunkOfReviews;
    }
    this.localsReservations.subscribe(res =>{
      this.localsReservationsPage = res.slice(this.startIndex, this.endIndex);
    });
  }

  openDialog(action:string , reservation: any){
    const dialogObj = {
      action: action,
      data: reservation
    }
    
    const dialogRef = this.editDialog.open(TableActionDialogComponent, {
      width: '350px',
      data:dialogObj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null && result.event !== "Cancel"){
        
        const updateAndRefetchReservations = async () =>{
          await this.reservationsService.updateStatusReservation(result.data)
  
          await this.fetchReservations();
        }
  
        updateAndRefetchReservations();
      }
    });
  }
}