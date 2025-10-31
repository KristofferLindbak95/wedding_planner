import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddTableDialogComponent } from "src/app/dialogs/add-table-dialog/add-table-dialog.component";
import { DeleteTableDialogComponent } from "src/app/dialogs/delete-table-dialog/delete-table-dialog.component";
import { EditGuestForChairComponent } from "src/app/dialogs/edit-guest-for-chair/edit-guest-for-chair.component";
import { SupabaseService } from "src/app/services/supabase.service";

@Component({
  selector: 'app-tables',
  templateUrl: 'tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  public tables2: any = [];
  public tables: any = [];
  public tableRelations: any = [];
  public guests: any = [];

  constructor(private _dialog: MatDialog, private _supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.getData();
  }

  public async deleteTable(table: any) {
    const dialogRef = this._dialog.open(DeleteTableDialogComponent, {
      data: {
        id: table.id,
        table_number: table.table_number,
        table_relations: this.tableRelations
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  public async openDialog() {
    const dialogRef = this._dialog.open(AddTableDialogComponent, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  private async getData() {
    this.tables = await this._supabaseService.getTableData('tables');

    this.tables.sort((a: any, b: any) => b.table_number - a.table_number);

    this.tableRelations = await this._supabaseService.getTableData('tables_guests_relation');

    this.guests = await this._supabaseService.getTableData('guests');
    this.guests.sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sorter liste etter fornavn
    this.tables.forEach((table: any) => {
      table.persons = [];
      const relation = this.tableRelations.filter((rel: any) => rel.table_id === table.id);
      relation.forEach((rel: any) => {
        const guest = this.guests.find((guest: any) => guest.id === rel.guest_id);
        table.persons.push({
          'id': guest.id,
          'name': guest.name,
          'rel_id': rel.id,
          'rel_chair_number': rel.chair_number
        });
      });
      table.persons.sort((a: any, b: any) => a.rel_chair_number - b.rel_chair_number);
    });
  }

  public getPersonForChair(table: any, chairIndex: number) {
    const personForChair = table.persons?.find((x: any) => x.rel_chair_number === chairIndex);
    return personForChair || null; // Return the person object or null
  }

  public getChairs(count: number): any[] {
    return new Array(count);
  }

  public getChairStyle(index: number, total: number): any {
    // Use viewport units to maintain consistent spacing across all screen sizes
    const tableRadiusVh = 25; // Table circle radius in vh units (half of 30vh)
    const spacingVh = 2; // Fixed spacing in vh units - won't scale with screen width

    const chairRadiusVh = tableRadiusVh + spacingVh; // Total radius in vh units

    const angle = (2 * Math.PI * index) / total - Math.PI / 2; // Start from top

    // Center point in viewport units
    const centerX = 50; // Still use percentage for horizontal centering
    const centerY = 35; // 35vh (middle of 70vh container)

    // Calculate positions using vh for consistent spacing
    const xVh = chairRadiusVh * Math.cos(angle);
    const yVh = chairRadiusVh * Math.sin(angle);

    return {
      top: `calc(${centerY + yVh}vh - 60px)`,  // Now 60px (half of 120px height)
      left: `calc(${centerX}% + ${xVh}vh - 60px)` // Still 60px (half of 120px width)
    };
  }

  public async changeGuestForChair(table: any, i: number) {
    const filteredGuests = this.guests.filter(
      (guest: any) => !this.tableRelations.some((rel: any) => rel.guest_id === guest.id)
    );
    const dialogRef = this._dialog.open(EditGuestForChairComponent, {
      data: {
        guests: filteredGuests, // Sender bare de gjestene som ikke er plassert ved et bord..
        table: table,
        index: i
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }
}
