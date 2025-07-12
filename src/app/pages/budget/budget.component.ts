import { Component, OnInit } from "@angular/core";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  public budget: any = [];
  public hasNotBeenPaid: any = [];
  public hasBeenPaid: any = [];
  public totalUnpaid: number = 0;
  public totalPaid: number = 0;
  private supabase: SupabaseClient;

  constructor () {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    await this.getData();
  }

  protected async getData() {
    this.budget = await this.getTableData('budget');
    this.hasNotBeenPaid = this.budget.filter((x: any) => !x.has_been_paid);
    this.hasBeenPaid = this.budget.filter((x: any) => x.has_been_paid);

    this.totalUnpaid = this.hasNotBeenPaid.reduce((sum: any, product: any) => sum + product.price, 0);
    this.totalPaid = this.hasBeenPaid.reduce((sum: any, product: any) => sum + product.price, 0);
    console.log(this.totalUnpaid);
  }

  async drop(event: CdkDragDrop<string[] | any>) {
    // await this.supabase.from('guests').update({ 'name': formData.name, 'category': formData.category }).eq('id', this.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const itemToUpdate = event.container.data[event.currentIndex];
      await this.supabase.from('budget').update({ 'payment_date': new Date().toISOString(), 'has_been_paid': !itemToUpdate.has_been_paid }).eq('id', itemToUpdate.id);
    }


  }

  protected async getTableData(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) {
      throw error;
    }
    return data;
  }
}
