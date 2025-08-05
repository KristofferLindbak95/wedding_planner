import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AddCostDialogComponent } from "src/app/dialogs/add-cost-dialog/add-cost-dialog.component";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  public budget: any = [];
  public totalHasBeenPaid: number = 0;
  public estimatedCost: number = 0;
  public actualCost: number = 0;
  private supabase: SupabaseClient;

  constructor (private _dialog: MatDialog) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    await this.getData();
  }

  protected openDialog() {
    const dialogRef = this._dialog.open(AddCostDialogComponent, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  protected async getData() {
    this.budget = await this.getTableData('budget');
    this.budget.sort((a: any, b: any) => a.description.localeCompare(b.description));
    this.totalHasBeenPaid = this.budget.filter((x: any) => x.has_been_paid).reduce((sum: number, x: any) => sum + x.has_been_paid, 0);
    this.estimatedCost = this.budget.filter((x: any) => x.estimated_cost).reduce((sum: number, x: any) => sum + x.estimated_cost, 0);
    this.actualCost = this.budget.filter((x: any) => x.actual_cost).reduce((sum: number, x: any) => sum + x.actual_cost, 0);
  }

  protected async getTableData(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) {
      throw error;
    }
    return data;
  }
}
