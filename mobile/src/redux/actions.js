// Action types
export const UPDATE_WATER_UNIT = "update/water_unit";
export const UPDATE_COFFEE_UNIT = "update/coffee_unit";
export const UPDATE_TEMP_UNIT = "update/temp_unit";
export const UPDATE_AUTOFILL_RATIO = "update/autofill_ratio";
export const UPDATE_RATIO = "update/ratio";
export const UPDATE_GRINDER = "update/grinder";
export const UPDATE_THEME = "update/theme";
export const UPDATE_NOTIFICATION_TIME = "update/notification_time";
export const UPDATE_NOTIFICATIONS_ACTIVE = "update/notifications_active";
export const UPDATE_SAMPLE_DATA = "update/sample_data";

export const updateWaterUnit = (unit) => ({
    type: UPDATE_WATER_UNIT,
    payload: unit,
});

export const updateCoffeeUnit = (unit) => ({
    type: UPDATE_COFFEE_UNIT,
    payload: unit,
});

export const updateTempUnit = (unit) => ({
    type: UPDATE_TEMP_UNIT,
    payload: unit,
});

export const updateAutofillRatio = (bool) => ({
    type: UPDATE_AUTOFILL_RATIO,
    payload: bool,
});

export const updateRatio = (value) => ({
    type: UPDATE_RATIO,
    payload: value,
});

export const updateGrinder = (value) => ({
    type: UPDATE_GRINDER,
    payload: value,
});

export const updateTheme = (value) => ({
    type: UPDATE_THEME,
    payload: value,
});

export const updateNotificationTime = (value) => ({
    type: UPDATE_NOTIFICATION_TIME,
    payload: value.toISOString(),
});

export const updateNotificationsActive = (value) => ({
    type: UPDATE_NOTIFICATIONS_ACTIVE,
    payload: value,
});

export const updateSampleData = (value) => ({
    type: UPDATE_SAMPLE_DATA,
    payload: value,
});
