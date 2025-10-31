import { Component, OnInit } from '@angular/core';
import { AddGuestDialogComponent } from '../../dialogs/add-guest-dialog/add-guest-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteGuestDialogComponent } from '../../dialogs/delete-guest-dialog/delete-guest-dialog.component';
import { EditGuestDialogComponent } from '../../dialogs/edit-guest-dialog/edit-guest-dialog.component';
import { SupabaseService } from 'src/app/services/supabase.service';


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  public guests: any = [];
  public allGuests: any = [];
  public categories: any = [];
  public tablesRelations: any = [];
  public tables: any = [];
  public filterCounts: any = [];
  public filterGuests: any = [];

  constructor(private _dialog: MatDialog, private _supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.getData();
  }

  public search(searchInput: string) {
    setTimeout(() => {
        this.filterGuests = this.allGuests.filter((x: any) => x.name.toLowerCase().includes(searchInput.toLowerCase()) || x.category?.toLowerCase() === searchInput.toLowerCase() || x.allergies?.toLowerCase().includes(searchInput.toLowerCase()) || ('allergier'.includes(searchInput.toLowerCase()) && x.allergies) || ('forlovere'.includes(searchInput.toLowerCase()) && x.best_man) || (x.table?.toString().toLowerCase().includes(searchInput.toString().toLowerCase())));
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
    const dialogRef = this._dialog.open(EditGuestDialogComponent, {
      data: {
        id: guest.id,
        name: guest.name,
        category: this.categories.find((x: any) => x.description.toLowerCase() === guest.category.toLowerCase())?.id,
        categories: this.categories,
        allergies: guest.allergies,
        best_man: guest.best_man
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
    this.categories = await this._supabaseService.getTableData('categories');
    this.tablesRelations = await this._supabaseService.getTableData('tables_guests_relation');
    this.tables = await this._supabaseService.getTableData('tables');
    this.guests = await this._supabaseService.getTableData('guests');
    this.guests.sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sorter liste etter fornavn

    this.guests.forEach((guest: any) => {
      guest.category = this.categories.find((cat: any) => cat.id === guest.category)?.description;
      const tableRelation = this.tablesRelations.find((rel: any) => rel.guest_id === guest.id)
      console.log('tableRelation', tableRelation)
      if (tableRelation) {
        const table = this.tables.find((table: any) => table.id === tableRelation.table_id);
        if (table) {
          guest.table = table.table_number;
        }
      }
    });

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
}
