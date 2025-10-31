import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-delete-table-dialog',
    templateUrl: './delete-table-dialog.component.html'
})
export class DeleteTableDialogComponent {
  public id: number;
  public table_number: number;
  public table_relations: any = [];
  private supabase: SupabaseClient;

  constructor(public dialogRef: MatDialogRef<DeleteTableDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = this.data.id;
    this.table_number = this.data.table_number;
    this.table_relations = this.data.table_relations;
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  public async deleteTable() {
    await this.supabase.from('tables').delete().eq('id', this.id);
    const tableRelations = this.table_relations.filter((rel: any) => rel.table_id === this.id);
    const idsToDelete = tableRelations.map((rel: any) => rel.id);
    await this.supabase.from('tables_guests_relation').delete().in('id', idsToDelete);
    this.closeDialog(true);
  }

  public closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }
}
