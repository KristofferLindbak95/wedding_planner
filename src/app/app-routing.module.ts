import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestListComponent } from './pages/guest-list/guest-list.component';
import { BudgetComponent } from './pages/budget/budget.component';
import { TablesComponent } from './pages/tables/tables.component';

const routes: Routes = [
  { path: 'guestlist', component: GuestListComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'tables', component: TablesComponent },
  { path: '', redirectTo: 'guestlist', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
