import { MatSnackBar } from '@angular/material';
import { Api } from './../../api/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public email: string = "";
  constructor(
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  addNewsletterEmail(){
    Api.addNewsletterEmail(this.email)
      .then(response => {
        this.snackbar.open(response.message, "Close", {
          duration:2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ["red-snackbar"]
        })
        this.email = "";
        
      })
      .catch(err => {
        this.snackbar.open(err.error, "Close", {
          duration:2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ["red-snackbar"]
        })
        this.email = "";
      });
  }

  public emailChange($event) {
    this.email = $event.target.value;
  }
}
