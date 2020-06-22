import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-table-action-dialog',
  templateUrl: './table-action-dialog.component.html',
  styleUrls: ['./table-action-dialog.component.scss']
})
export class TableActionDialogComponent implements OnInit {

  action:string;
  local_data:any;
  public dateFormGroup: FormGroup;
  public hourFormGroup: FormGroup;
  public seatsFormGroup: FormGroup;
  

  constructor(
    private updateReservationFormBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TableActionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data:any
  ) {
    this.local_data = {...data.data};
    this.action = this.data.action;
  }

  doAction(){
    if(this.action === "Change reservation"){
      const date = this.dateFormGroup.get("dateCtrl").value;
      const hour = this.hourFormGroup.get("hourCtrl").value;
      const seats = this.seatsFormGroup.get("seatsCtrl").value;

      if(date) this.local_data.date = new Date(date).toLocaleDateString();
      if(hour) this.local_data.hour = hour;
      if(seats) this.local_data.seats = seats;
    }
    
    this.dialogRef.close({event:this.action, data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:"Cancel"});
  }
  ngOnInit() {
    this.dateFormGroup = this.updateReservationFormBuilder.group({
      dateCtrl: ['', Validators.required]
    })
    this.hourFormGroup = this.updateReservationFormBuilder.group({
      hourCtrl: ['', Validators.required]
    })
    this.seatsFormGroup = this.updateReservationFormBuilder.group({
      seatsCtrl: ['', Validators.required]
    })
  }

}
