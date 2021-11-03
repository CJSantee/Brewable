export const updateWaterUnit = unit => (
    {
        type: 'update/water_unit',
        payload: unit
    }
);

export const updateCoffeeUnit = unit => (
    {
        type: 'update/coffee_unit',
        payload: unit
    }
);

export const updateTempUnit = unit => (
    {
        type: 'update/temp_unit',
        payload: unit
    }
);

export const updateRatio = value => (
    {
        type: 'update/ratio',
        payload: value        
    }
);

export const updateTheme = value => (
    {
        type: 'update/theme',
        payload: value
    }
);

export const updateSampleData = value => (
    {
        type: 'update/sample_data',
        payload: value
    }
);
