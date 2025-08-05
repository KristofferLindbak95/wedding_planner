import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { AuthComponent } from './auth/auth.component'
import { AccountComponent } from './account/account.component'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import DashboardComponent from './pages/guestlist/dashboard.component'
import { Datepipe } from './pipes/datepipe'
import { DatePipe } from '@angular/common'
import { AddGuestDialogComponent } from './dialogs/add-guest-dialog/add-guest-dialog.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DeleteGuestDialogComponent } from './dialogs/delete-guest-dialog/delete-guest-dialog.component'
import { EditGuestDialogComponent } from './dialogs/edit-guest-dialog/edit-guest-dialog.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { BudgetComponent } from './pages/budget/budget.component'
import { AddCostDialogComponent } from './dialogs/add-cost-dialog/add-cost-dialog.component'
import { DeleteCostDialogComponent } from './dialogs/delete-cost-dialog/delete-cost-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AccountComponent,
    DashboardComponent,
    SidebarComponent,
    BudgetComponent,
    AddGuestDialogComponent,
    AddCostDialogComponent,
    DeleteGuestDialogComponent,
    DeleteCostDialogComponent,
    EditGuestDialogComponent,
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
    MatTooltipModule,
    DragDropModule,
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
