import { ReservationsService } from './reservations-service/reservations.service';
import { LocalsService } from './local-service/locals.service';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroComponent } from './hero/hero.component';
import { SectionComponent } from './section/section.component';
import { SidesectionComponent } from './sidesection/sidesection.component';
import { LocalDetailsComponent } from './local-details/local-details.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatDialogModule,
  MatCheckboxModule,
  MatCardModule,
  MatTableModule,
  MatSnackBarModule,
  MatStepperModule,
  MatDatepickerModule,
  MatSelectModule,
  MatPaginatorModule
} from "@angular/material";
import {MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from "@angular/forms";
import { ReviewComponent } from './review/review.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { LocalsPageComponent } from './locals-page/locals-page.component';
import { MetadataComponent } from './metadata/metadata.component';
import { LocalCardComponent } from './local-card/local-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { LocalRegisterDialogComponent } from './local-register-dialog/local-register-dialog.component';
import { EditLocalComponent } from './edit-local/edit-local.component';

import { AmazingTimePickerModule } from 'amazing-time-picker';
import { TableActionDialogComponent } from './table-action-dialog/table-action-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    SectionComponent,
    SidesectionComponent,
    LocalDetailsComponent,
    FooterComponent,
    HomepageComponent,
    NavbarComponent,
    LogInComponent,
    SignUpComponent,
    ReviewComponent,
    ReviewListComponent,
    LocalsPageComponent,
    MetadataComponent,
    LocalCardComponent,
    UserProfileComponent,
    InfoDialogComponent,
    LocalRegisterDialogComponent,
    EditLocalComponent,
    TableActionDialogComponent,
    EditUserComponent,
  
  ],
  entryComponents: [
    InfoDialogComponent, 
    TableActionDialogComponent,
    LocalRegisterDialogComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatCarouselModule,
    MatTabsModule,
    SlickCarouselModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTableModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatStepperModule,
    MatNativeDateModule,
    MatSelectModule,
    AmazingTimePickerModule,
    MatPaginatorModule,
    RouterModule.forRoot([
      {path : '', component:HomepageComponent},
      {path : 'login', component:LogInComponent},
      {path : 'signup', component:SignUpComponent},
      {path : 'locals/:name', component: LocalDetailsComponent},
      {path : 'locals/:name/edit', component: EditLocalComponent},
      {path : 'locals', component:LocalsPageComponent},
      {path : 'account/:userId', component: UserProfileComponent},
      {path : 'account/:userId/edit', component: EditUserComponent}
    ]),
    BrowserAnimationsModule
  ],
  providers: [LocalsService, ReservationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
