import { createAction, props } from '@ngrx/store';
import { CountriesData, FeatureData } from '@shared/models';

export const loadData = createAction(
    '[Map] Load Data',
    props<{ map: CountriesData }>()
);

export const loadColoredCountry = createAction(
    '[Map] Load Colored Country',
    props<{ country: FeatureData }>()
);

export const resetColoredCountries = createAction(
    '[Map] Reset Colored Countries'
);

export const MapActions = {
    loadData: loadData,
    loadColoredCountry: loadColoredCountry,
    resetColoredCountries
};