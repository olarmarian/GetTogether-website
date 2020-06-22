import { LocalsService } from './../local-service/locals.service';
import { ReservationsService } from "./../reservations-service/reservations.service";
import { MatSnackBar } from "@angular/material";
import { ILocal } from "./../../utils/ILocal";
import { Component, OnInit } from "@angular/core";
import { InfoDialogComponent } from "./../info-dialog/info-dialog.component";
import { IUser } from "src/utils/IUser";
import { UserService } from "../user-service/user-service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TableActionDialogComponent } from "../table-action-dialog/table-action-dialog.component";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  private info: string =
    "You have no local registered ! Do you want to start your own bussiness ?";
  private answer: boolean;
  public user: IUser = null;

  public recommendedLocals: any[] = [];
  public reservationsHistory = new BehaviorSubject<any[]>([]);
  public reservationsHistoryPage: any[] = [];

  public activeReservations = new BehaviorSubject<any[]>([]);
  public activeReservationsPage: any[] = [];
  public error: string = null;
  public local: ILocal = null;
  public userId: string = "";

  public activeReservationsLength: number = 0;
  public resservationsHistoryLength: number = 0;

  startIndexHistoryPage: number = 0;
  endIndexHistoryPage: number = 5;

  startIndexActivePage: number = 0;
  endIndexActivePage: number = 5;

  chunkOfReviews: number = 5;
  limitPage: number = 5;
  displayedColumns: string[] = ["localName", "date", "hour", "seats", "status"];
  activeDisplayedColumns: string[] = [
    "localName",
    "date",
    "hour",
    "seats",
    "status",
    "actions",
  ];

  constructor(
    private userService: UserService,
    private localsService: LocalsService,
    private reservationsService: ReservationsService,
    private router: Router,
    private errorSnackbar: MatSnackBar,
    private checkDialog: MatDialog,
    private editDialog: MatDialog
  ) {}

  async ngOnInit() {
    this.userId = sessionStorage.getItem("userId");

    await this.userService
      .getAccount(this.userId)
      .then((response) => {
        this.user = {
          createdAt: response.createdAt,
          email: response.email,
          name: response.name,
          phone: response.phone,
          role: response.role,
          localId: response.localId,
        };
      })
      .catch(() => {
        this.router.navigateByUrl("");
      });

    await this.userService
      .getUserLocal(this.user.email)
      .then((response) => {
        this.local = response;
      })
      .catch(() => {
        this.local = null;
      });

    await this.fetchReservationsHistory();
    await this.fetchActiveReservations();

    const locals = await this.localsService.getLocals()
    locals.subscribe(res => {
      
      this.recommendedLocals = []
      if(res.length > 0){
        for(let i = 0; i < 4; i++){
            let item = res[Math.floor(Math.random() * res.length)];
            if(res.length < 4) {
              this.recommendedLocals.push(item);
              continue;
            }else{
              while(this.recommendedLocals.includes(item)){
                item = res[Math.floor(Math.random() * res.length)];
              }
              this.recommendedLocals.push(item)
            }
        }
      }
    })
  }

  openLocalPage(): void {
    if (this.local === null) {
      this.checkDialog.open(InfoDialogComponent, {
        width: "450px",
        data: { info: this.info, answer: this.answer },
      });
    } else {
      window.location.assign(`/locals/${this.local.searchName}`);
    }
  }

  openEditPage(): void {
    this.router.navigateByUrl(`/account/${this.userId}/edit`)
  }

  onHistoryPageChanged(event) {
    const prevPageIndex = event.previousPageIndex;
    const pageIndex = event.pageIndex;

    let reservationsHistoryLength = 0;
    this.reservationsHistory.subscribe((res) => {
      reservationsHistoryLength = res.length;
    });
    if (prevPageIndex < pageIndex) {
      this.startIndexHistoryPage = this.endIndexHistoryPage;
      if (
        this.endIndexHistoryPage + this.chunkOfReviews >
        reservationsHistoryLength
      ) {
        this.endIndexHistoryPage = reservationsHistoryLength;
      } else {
        this.endIndexHistoryPage + this.chunkOfReviews;
      }
    } else if (prevPageIndex > pageIndex) {
      this.endIndexHistoryPage = this.startIndexHistoryPage;
      this.startIndexHistoryPage -= this.chunkOfReviews;
    }
    this.reservationsHistory.subscribe((res) => {
      this.reservationsHistoryPage = res.slice(
        this.startIndexHistoryPage,
        this.endIndexHistoryPage
      );
    });
  }

  onActiveReservationsPageChanged(event) {
    const prevPageIndex = event.previousPageIndex;
    const pageIndex = event.pageIndex;
    let activeReservationsLength = 0;

    this.activeReservations.subscribe((res) => {
      activeReservationsLength = res.length;
    });
    if (prevPageIndex < pageIndex) {
      this.startIndexActivePage = this.endIndexActivePage;
      if (
        this.endIndexActivePage + this.chunkOfReviews >
        activeReservationsLength
      ) {
        this.endIndexActivePage = activeReservationsLength;
      } else {
        this.endIndexActivePage + this.chunkOfReviews;
      }
    } else if (prevPageIndex > pageIndex) {
      this.endIndexActivePage = this.startIndexActivePage;
      this.startIndexActivePage -= this.chunkOfReviews;
    }
    this.activeReservations.subscribe((res) => {
      this.activeReservationsPage = res.slice(
        this.startIndexActivePage,
        this.endIndexActivePage
      );
    });
  }

  async fetchReservationsHistory() {
    await this.reservationsService
      .getReservationHistory(this.userId)
      .then((response) => {
        this.reservationsHistory.next(response);
        this.reservationsHistory.subscribe((res) => {
          this.resservationsHistoryLength = res.length;
          this.reservationsHistoryPage = res.slice(
            this.startIndexHistoryPage,
            this.endIndexHistoryPage
          );
        });
      })
      .catch(() => {
        this.errorSnackbar.open("Couldn't get reservations history. Service is not responding.", "Close", {
          duration: 2000,
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      });
  }

  async fetchActiveReservations() {
    await this.reservationsService
      .getActiveReservations(this.userId)
      .then((response) => {
        this.startIndexActivePage = 0;
        this.endIndexActivePage = this.limitPage;

        this.activeReservations.next(response);
        this.activeReservations.subscribe((res) => {
          this.activeReservationsPage = res.slice(
            this.startIndexActivePage,
            this.endIndexActivePage
          );
        });
      })
      .catch((err) => {
        this.errorSnackbar.open("Couldn't get active reservations. Service is not responding.", "Close", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "center",
          panelClass: ["red-snackbar"],
        });
      });
  }

  openDialog(action: string, reservation: any) {
    const dialogObj = {
      action: action,
      data: reservation,
    };

    const dialogRef = this.editDialog.open(TableActionDialogComponent, {
      width: "350px",
      data: dialogObj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result.event === "Change reservation") {
        const updateAndRefetchReservations = async () => {
          await this.reservationsService.updateReservation(result.data);

          await this.fetchActiveReservations();
          await this.fetchReservationsHistory();
        };

        updateAndRefetchReservations();
      }
    });
  }
}
