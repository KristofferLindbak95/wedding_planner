import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-add-table-dialog',
  templateUrl: 'add-table-dialog.component.html'
})
export class AddTableDialogComponent {
  public addTableForm: any;
  private _supabase: SupabaseClient;

  constructor(public dialogRef: MatDialogRef<AddTableDialogComponent>, private _formBuilder: FormBuilder) {
    this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.createFormGroup();
  }

  public async addTable() {
    const formData = this.addTableForm.value;
    await this._supabase.from('tables').insert({ table_number: formData.table_number, number_of_people: formData.number_of_people });

    this.closeDialog(true);
  }

  private createFormGroup() {
    this.addTableForm = this._formBuilder.group({
      table_number: [null],
      number_of_people: [null]
    });
  }

  public closeDialog(result: boolean) {
    console.log('dialog close trigger', result);
    this.dialogRef.close(result);
  }
}
