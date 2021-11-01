const initialState = {
    user_preferences: {
        water_unit: "oz",
        coffee_unit: "g",
        temp_unit: "f",
        ratio: 16,
        theme: "Light"
    }
}

const preferenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'update/water_unit':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    water_unit: action.payload
                }
            };
        case 'update/coffee_unit':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    coffee_unit: action.payload
                }
            };
        case 'update/temp_unit':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    temp_unit: action.payload
                }
            };
        case 'update/ratio':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    ratio: action.payload
                }
            }
        case 'update/theme':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    theme: action.payload
                }
            }
        default:
            return state;
    }
}

export { preferenceReducer };