const initialState = {
    user_preferences: {
        water_unit: "oz",
        coffee_unit: "g",
        temp_unit: "f",
        ratio: 16,
        theme: "Light"
    },
    sample_data: false,
}

const preferenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'update/water_unit':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    water_unit: action.payload
                },
                sample_data: state.sample_data
            };
        case 'update/coffee_unit':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    coffee_unit: action.payload
                },
                sample_data: state.sample_data
            };
        case 'update/temp_unit':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    temp_unit: action.payload
                },
                sample_data: state.sample_data
            };
        case 'update/ratio':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    ratio: action.payload
                },
                sample_data: state.sample_data
            }
        case 'update/theme':
            return {
                user_preferences: {
                    ...state.user_preferences,
                    theme: action.payload
                },
                sample_data: state.sample_data
            }
        case 'toggle/sample_data':
            return {
                user_preferences: {
                    ...state.user_preferences
                },
                sample_data: !state.sample_data
            }
        default:
            return state;
    }
}

export { preferenceReducer };