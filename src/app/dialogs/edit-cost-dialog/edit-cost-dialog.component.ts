import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-edit-cost-dialog',
  templateUrl: 'edit-cost-dialog.component.html'
})
export class EditCostDialogComponent {
  public id: number;
  public editCostForm: any;
  public description: string;
  public estimated_cost: number;
  public actual_cost: number;
  public has_been_paid: number;
  private supabase: SupabaseClient;

  constructor(public dialogRef: MatDialogRef<EditCostDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) {
    this.id = this.data.id;
    this.description = this.data.description;
    this.estimated_cost = this.data.estimated_cost;
    this.actual_cost = this.data.actual_cost;
    this.has_been_paid = this.data.has_been_paid;
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.createFormGroup();
  }

  public async editCost() {
    const formData = this.editCostForm.value;
    await this.supabase.from('budget').update({ 'description': formData.description, 'estimated_cost': formData.estimated_cost, 'actual_cost': formData.actual_cost, 'has_been_paid': formData.has_been_paid }).eq('id', this.id);

    this.closeDialog(true);
  }

  public closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }

  private createFormGroup() {
    this.editCostForm = this._formBuilder.group({
      description: [''],
      estimated_cost: [null],
      actual_cost: [null],
      has_been_paid: [null]
    });
    this.mapFormToModel();
  }

  private mapFormToModel() {
    this.editCostForm.patchValue({ description: this.description });
    this.editCostForm.patchValue({ estimated_cost: this.estimated_cost });
    this.editCostForm.patchValue({ actual_cost: this.actual_cost });
    this.editCostForm.patchValue({ has_been_paid: this.has_been_paid });
  }
}
