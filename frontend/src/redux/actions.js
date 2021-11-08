// Action types
export const UPDATE_WATER_UNIT = 'update/water_unit';
export const UPDATE_COFFEE_UNIT = 'update/coffee_unit';
export const UPDATE_TEMP_UNIT = 'update/temp_unit';
export const UPDATE_RATIO = 'update/ratio';
export const UPDATE_THEME = 'update/theme';
export const UPDATE_SAMPLE_DATA = 'update/sample_data';

export const updateWaterUnit = unit => (
    {
        type: UPDATE_WATER_UNIT,
        payload: unit
    }
);

export const updateCoffeeUnit = unit => (
    {
        type: UPDATE_COFFEE_UNIT,
        payload: unit
    }
);

export const updateTempUnit = unit => (
    {
        type: UPDATE_TEMP_UNIT,
        payload: unit
    }
);

export const updateRatio = value => (
    {
        type: UPDATE_RATIO,
        payload: value        
    }
);

export const updateTheme = value => (
    {
        type: UPDATE_THEME,
        payload: value
    }
);

export const updateSampleData = value => (
    {
        type: UPDATE_SAMPLE_DATA,
        payload: value
    }
);
