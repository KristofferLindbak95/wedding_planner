import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Component({ 
    selector: 'app-delete-guest-dialog',
    templateUrl: './delete-guest-dialog.component.html'
})
export class DeleteGuestDialogComponent {
    public id: number;
    public name: string;
    private supabase: SupabaseClient;

    constructor(public dialogRef: MatDialogRef<DeleteGuestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.id = this.data.id;
        this.name = this.data.name;
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
    
    public async deleteGuest() {
        await this.supabase.from('guests').delete().eq('id', this.id);
        this.closeDialog(true);
    }

    public closeDialog(result: boolean) {
        this.dialogRef.close(result);
    }

}