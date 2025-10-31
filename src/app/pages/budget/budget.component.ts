import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddCostDialogComponent } from "src/app/dialogs/add-cost-dialog/add-cost-dialog.component";
import { DeleteCostDialogComponent } from "src/app/dialogs/delete-cost-dialog/delete-cost-dialog.component";
import { EditCostDialogComponent } from "src/app/dialogs/edit-cost-dialog/edit-cost-dialog.component";
import { SupabaseService } from "src/app/services/supabase.service";

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

  constructor (private _dialog: MatDialog, private _supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.getData();
  }

  public openDialog() {
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
    this.budget = await this._supabaseService.getTableData('budget');
    this.budget.sort((a: any, b: any) => a.description.localeCompare(b.description));
    this.totalHasBeenPaid = this.budget.filter((x: any) => x.has_been_paid).reduce((sum: number, x: any) => sum + x.has_been_paid, 0);
    this.estimatedCost = this.budget.filter((x: any) => x.estimated_cost).reduce((sum: number, x: any) => sum + x.estimated_cost, 0);
    this.actualCost = this.budget.filter((x: any) => x.actual_cost).reduce((sum: number, x: any) => sum + x.actual_cost, 0);
  }

  public async editCost(item: any) {
    const dialogRef = this._dialog.open(EditCostDialogComponent, {
      data: {
        id: item.id,
        description: item.description,
        estimated_cost: item.estimated_cost,
        actual_cost: item.actual_cost,
        has_been_paid: item.has_been_paid
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log(result);
        this.getData();
      }
    });
  }

  public async deleteCost(item: any) {
    const dialogRef = this._dialog.open(DeleteCostDialogComponent, {
      data: {
        id: item.id,
        description: item.description
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  protected paymentStatusColorIndicator(item: any) {
    if (item.has_been_paid > 0 && item.has_been_paid === item.actual_cost) {
      return 'lightgreen';
    } else if (item.has_been_paid > 0 && item.has_been_paid < item.actual_cost) {
      return 'yellow';
    } else {
      return;
    }
  }
}
