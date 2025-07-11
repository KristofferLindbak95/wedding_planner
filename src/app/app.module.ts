import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { AuthComponent } from './auth/auth.component'
import { AccountComponent } from './account/account.component'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import DashboardComponent from './pages/dashboard.component'
import { Datepipe } from './pipes/datepipe'
import { DatePipe } from '@angular/common'
import { AddGuestDialogComponent } from './dialogs/add-guest-dialog.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AccountComponent,
    DashboardComponent,
    AddGuestDialogComponent,
    Datepipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    BrowserAnimationsModule
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
