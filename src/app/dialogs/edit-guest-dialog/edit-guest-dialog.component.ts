import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-guest-dialog',
    templateUrl: './edit-guest-dialog.component.html'
})
export class EditGuestDialogComponent {
    public id: number;
    public name: string;
    public category: number;
    public allergies: string;
    public best_man: boolean;
    public editGuestForm: any;
    public categories: any = [];
    private supabase: SupabaseClient;

    constructor(public dialogRef: MatDialogRef<EditGuestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) {
        this.id = this.data.id;
        this.name = this.data.name;
        this.category = this.data.category;
        this.categories = this.data.categories || [];
        this.allergies = this.data.allergies;
        this.best_man = this.data.best_man;
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.createFormGroup();
    }

    public async editGuest() {
        const formData = this.editGuestForm.value;
        await this.supabase.from('guests').update({ 'name': formData.name, 'category': formData.category, 'allergies': formData.allergies, 'best_man': formData.best_man }).eq('id', this.id);
    
        this.closeDialog(true);
    }

    public closeDialog(result: boolean) {
        this.dialogRef.close(result);
    }

    private createFormGroup() {
        this.editGuestForm = this._formBuilder.group({
          name: [''],
          category: [''],
          allergies: [''],
          best_man: ['']
        });
        this.mapModelToForm();
    }

    private mapModelToForm(){
        this.editGuestForm.patchValue({ 'name': this.name });
        this.editGuestForm.patchValue({ 'category': this.category });
        this.editGuestForm.patchValue({ 'allergies': this.allergies });
        this.editGuestForm.patchValue({ 'best_man': this.best_man });
    }
}