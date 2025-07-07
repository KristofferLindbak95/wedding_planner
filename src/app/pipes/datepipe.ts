import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'datepipe' })
export class Datepipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(date: Date | string | number): string | null {
    if (!date) {
      return null;
    }

    // Use Angular's built-in DatePipe to format the date
    return this.datePipe.transform(date, 'dd.MM.yyyy');
  }
}
