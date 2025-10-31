import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-edit-guest-for-chair',
  templateUrl: 'edit-guest-for-chair.component.html'
})
export class EditGuestForChairComponent {
  public guests: any;
  public table: any;
  public index: number;
  public editGuestForChairForm: any;
  private supabase: SupabaseClient;

  constructor(public dialogRef: MatDialogRef<EditGuestForChairComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) {
    this.guests = this.data.guests;
    this.table = this.data.table;
    this.index = this.data.index;
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.createFormGroup();
  }

  private createFormGroup() {
    this.editGuestForChairForm = this._formBuilder.group({
      guest_id: ['']
    });
    this.mapModelToForm();
  }

  private mapModelToForm(){
    const currentGuestForChair = this.table.persons.find((x: any) => x.rel_chair_number === this.index)?.id;
    if (currentGuestForChair) {
    this.editGuestForChairForm.patchValue({ 'guest_id': currentGuestForChair });
    }
  }

  public async editGuestForChair() {
    const formData = this.editGuestForChairForm.value;
    const relationId = this.table.persons.find((x: any) => x.rel_chair_number === this.index)?.rel_id;

    if (relationId && formData.guest_id > 0) { // This chair already has a person and you want to update the person.
      console.log('trigger 1');
      await this.supabase.from('tables_guests_relation').update({ 'guest_id': formData.guest_id }).eq('id', relationId);
    } else if (relationId && Number(formData.guest_id) === 0) { // This chair has a person that u want to remove.
      console.log('trigger 2');
      await this.supabase.from('tables_guests_relation').delete().eq('id', relationId); // her må relasjonsiden sendes inn i stede for table iden.
    } else { // This chair dosent have a person but you want to add one.
      console.log('trigger 3');
      await this.supabase.from('tables_guests_relation').insert({ table_id: this.table.id, guest_id: formData.guest_id, chair_number: this.index });
    }

    this.closeDialog(true);
  }

  public closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }
}
