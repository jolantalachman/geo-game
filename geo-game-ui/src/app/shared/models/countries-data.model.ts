import type { GeoJsonObject, GeoJsonGeometry } from 'geojson';

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

export interface GeometryData {
  type: string;
  // Using GeoJSON geometry typing for coordinates
  coordinates: GeoJsonGeometry['coordinates'];
}