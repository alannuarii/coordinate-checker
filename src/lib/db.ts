import Dexie, { Table } from 'dexie';

export interface Coordinate {
  id?: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  label: string;
  address?: string; // New field for Geocoding information
}

export class CoordinateDB extends Dexie {
  coordinates!: Table<Coordinate>;

  constructor() {
    super('CoordinateDB');
    this.version(1).stores({
      coordinates: '++id, timestamp, label'
    });
  }
}

export const db = new CoordinateDB();
