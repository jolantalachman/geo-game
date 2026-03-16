import { CountriesData, FeatureData } from "@shared/models";

export interface MapState {
    map: CountriesData | null;
    coloredCountries: FeatureData[];
}

export const initialMapState: MapState = {
    map: null,
    coloredCountries: [],
};
