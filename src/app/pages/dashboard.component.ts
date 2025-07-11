import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AddGuestDialogComponent } from '../dialogs/add-guest-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent implements OnInit {
  public guests: any = [];
  public allGuests: any = [];
  public categories: any = [];
  public filterCounts: any = [];
  public filterGuests: any = [];
  private supabase: SupabaseClient;

  constructor(private _dialog: MatDialog) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    await this.getData();
  }

  public search(searchInput: string) {
    setTimeout(() => {
        this.filterGuests = this.allGuests.filter((x: any) => x.name.toLowerCase().includes(searchInput.toLowerCase()) || x.category.toLowerCase().includes(searchInput.toLowerCase()));
        this.guests = this.filterGuests;
        if (!searchInput && this.filterGuests.length === 0) {
          this.guests = this.allGuests;
        }
      }, 200);
  }

  public openDialog() {
    const dialogRef = this._dialog.open(AddGuestDialogComponent, {
      data: {
        categories: this.categories
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  public deleteGuest(id: number) {
    console.log('This trigger', id);
  }

  private async getData() {
    this.guests = await this.getTableData('guests');
    this.categories = await this.getTableData('categories');
    this.filterCounts = [];

    if (this.categories.length > 0) {
      this.guests.forEach((guest: any) => {
        guest.category = this.categories.find((cat: any) => cat.id === guest.category)?.description;
      });
    }

    // Sorter liste etter fornavn
    this.guests.sort((a: any, b: any) => a.name.localeCompare(b.name));

    this.categories.forEach((category: any) => {
      const data = {
        label: category.description,
        value: this.guests.filter((g: any) => g.category === category.description).length
      }
      this.filterCounts.push(data);
    });

    this.filterCounts.sort((a: any, b: any) => a.label.localeCompare(b.label));

    this.allGuests = this.guests;
  }

  private async getTableData(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) {
      throw error;
    }
    return data;
  }

}
