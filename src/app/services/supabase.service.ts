import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private _supabase: SupabaseClient;

  constructor() {
    this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  public async getTableData(tableName: string) {
    const { data, error } = await this._supabase.from(tableName).select('*');
    if (error) {
      throw error;
    }
    return data;
  }
}
