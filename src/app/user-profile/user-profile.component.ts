import { ILocal } from './../../utils/ILocal';
import { Component, OnInit } from '@angular/core';
import { InfoDialogComponent } from './../info-dialog/info-dialog.component';
import { IUser } from 'src/utils/IUser';
import { UserService } from '../user-service/user-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private info: string = "You have no local registered ! Do you want to start your own bussiness ?";
  private answer: boolean;
  public user:IUser = null;
  public reservationsHistory:any[] = [];
  public error:string = null;
  public local:ILocal = null;

  public columns:string[] = ["Local name", "Date", "Hour", "Seats", "Status"]
  
  constructor(
    private userService:UserService, 
    private router: Router, 
    private checkDialog: MatDialog) { }

  async ngOnInit() {
    const userId = sessionStorage.getItem("userId");
    
    await this.userService.getAccount(userId)
      .then(response => {
        this.user = {
          createdAt: response.createdAt,
          email: response.email,
          name: response.name,
          phone: response.phone,
          role: response.role,
          localId: response.localId
        }
      })
      .catch(() => {
        this.router.navigateByUrl('');
      })

    await this.userService.getUserLocal(this.user.email)
      .then(response => {
        this.local = response;
      })
      .catch(() => {
        this.local = null;
      })

    await this.userService.getReservationHistory(userId)
      .then(responseJson => {
        return responseJson.json();
      })
      .then(response => {
        response.forEach(item => {
          this.reservationsHistory.push({
            reservationId:item.reservationId,
            date:item.date,
            hour:item.hour,
            localId:item.localId,
            status:item.status,
            seats:item.seats,
            createdAt:item.createdAt,
          })
        })
      })
      .catch(err => {
        this.error = err;
      })
  }

  openLocalPage(): void {
    if(this.local === null){
      this.checkDialog.open(InfoDialogComponent, {
        width: '450px',
        data: {info: this.info, answer: this.answer}
      });
    }else{
      window.location.assign(`/locals/${this.local.searchName}`);
    }
  }
}