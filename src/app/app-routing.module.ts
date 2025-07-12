import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import DashboardComponent from './pages/guestlist/dashboard.component';
import { BudgetComponent } from './pages/budget/budget.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'budget', component: BudgetComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
