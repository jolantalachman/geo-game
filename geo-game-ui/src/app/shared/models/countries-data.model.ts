import type { GeoJsonObject, Geometry } from 'geojson';

export interface CountriesData extends GeoJsonObject {
  type: 'FeatureCollection';
  features: FeatureData[];
}

export interface FeatureData {
  type: 'Feature';
  properties: PropertiesData;
  id: string;
  geometry: GeometryData;
}

export interface PropertiesData {
  name: string;
  continent: string;
  center: [number, number];
}

export type GeometryData = Geometry;