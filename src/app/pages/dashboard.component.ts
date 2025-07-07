import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AddGuestDialogComponent } from '../dialogs/add-guest-dialog/add-guest-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteGuestDialogComponent } from '../dialogs/delete-guest-dialog/delete-guest-dialog.component';
import { EditGuestDialogComponent } from '../dialogs/edit-guest-dialog/edit-guest-dialog.component';


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
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  public async editGuest(guest: any) {
    console.log('guest: ', guest);
    const dialogRef = this._dialog.open(EditGuestDialogComponent, {
      data: {
        id: guest.id,
        name: guest.name,
        category: this.categories.find((x: any) => x.description.toLowerCase() === guest.category.toLowerCase())?.id,
        categories: this.categories
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  public async deleteGuest(guest: any) {
    const dialogRef = this._dialog.open(DeleteGuestDialogComponent, {
      data: {
        id: guest.id,
        name: guest.name
      }, 
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  private async getData() {
    this.categories = await this.getTableData('categories');
    this.guests = await this.getTableData('guests');
    this.guests.sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sorter liste etter fornavn

    if (this.categories.length > 0) {
      this.guests.forEach((guest: any) => {
        guest.category = this.categories.find((cat: any) => cat.id === guest.category)?.description;
      });
    }

    this.filterCounts = [];

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
