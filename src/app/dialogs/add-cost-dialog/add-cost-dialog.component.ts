import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-add-cost-dialog',
    templateUrl: 'add-cost-dialog.component.html'
})
export class AddCostDialogComponent {
    public addCostForm: any;
    private supabase: SupabaseClient;

    constructor(    
        public dialogRef: MatDialogRef<AddCostDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.createFormGroup();
    }

    public async addCost() {
        const formData = this.addCostForm.value;
        await this.supabase.from('budget').insert({ description: formData.description, estimated_cost: formData.estimated_cost, actual_cost: formData.actual_cost, has_been_paid: formData.has_been_paid });

        this.closeDialog(true);
    }

    public closeDialog(result: boolean) {
        this.dialogRef.close(result);
    }

    private createFormGroup() {
        this.addCostForm = this._formBuilder.group({
            description: [''],
            estimated_cost: [null],
            actual_cost: [null],
            has_been_paid: [null]
          });
    }
}