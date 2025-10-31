import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-add-guest-dialog',
  templateUrl: './add-guest-dialog.component.html',
  styleUrls: ['./add-guest-dialog.component.scss']
})
export class AddGuestDialogComponent {
  public addGuestForm: any;
  public categories: any = [];
  private _supabase: SupabaseClient;

  constructor(
    public dialogRef: MatDialogRef<AddGuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {
    this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.categories = this.data.categories || [];
    this.createFormGroup();
  }

  private createFormGroup() {
    this.addGuestForm = this._formBuilder.group({
      name: [''],
      category: [''],
      allergies: [''],
      best_man: [false]
    });
  }

  public async addGuest() {
    const formData = this.addGuestForm.value;
    await this._supabase.from('guests').insert({ name: formData.name, category: formData.category, allergies: formData.allergies, best_man: formData.best_man });

    this.closeDialog(true);
  }

  public closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }
}
