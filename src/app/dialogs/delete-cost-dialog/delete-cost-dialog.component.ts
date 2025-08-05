import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-delete-cost-dialog',
    templateUrl: 'delete-cost-dialog.component.html'
})
export class DeleteCostDialogComponent {
    public id: number;
    public description: string;
    private supabase: SupabaseClient;

    constructor(public dialogRef: MatDialogRef<DeleteCostDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.id = this.data.id;
        this.description = this.data.description;
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
    public async deleteGuest() {
        await this.supabase.from('budget').delete().eq('id', this.id);
        this.closeDialog(true);
    }

    public closeDialog(result: boolean) {
        this.dialogRef.close(result);
    }
}