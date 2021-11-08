import { 
    UPDATE_WATER_UNIT, 
    UPDATE_COFFEE_UNIT, 
    UPDATE_TEMP_UNIT, 
    UPDATE_AUTOFILL_RATIO,
    UPDATE_RATIO, 
    UPDATE_THEME, 
    UPDATE_SAMPLE_DATA 
} from "./actions";

const initialState = {
    user_preferences: {
        water_unit: "oz",
        coffee_unit: "g",
        temp_unit: "f",
        autofill_ratio: false,
        ratio: 16,
        theme: "Light"
    },
    sample_data: false,
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_WATER_UNIT:
            return {
                user_preferences: {
                    ...state.user_preferences,
                    water_unit: action.payload
                },
                sample_data: state.sample_data
            };
        case UPDATE_COFFEE_UNIT:
            return {
                user_preferences: {
                    ...state.user_preferences,
                    coffee_unit: action.payload
                },
                sample_data: state.sample_data
            };
        case UPDATE_TEMP_UNIT:
            return {
                user_preferences: {
                    ...state.user_preferences,
                    temp_unit: action.payload
                },
                sample_data: state.sample_data
            };
        case UPDATE_AUTOFILL_RATIO: 
            return {
                user_preferences: {
                    ...state.user_preferences,
                    autofill_ratio: action.payload
                },
                sample_data: state.sample_data
            }
        case UPDATE_RATIO:
            return {
                user_preferences: {
                    ...state.user_preferences,
                    ratio: action.payload
                },
                sample_data: state.sample_data
            }
        case UPDATE_THEME:
            return {
                user_preferences: {
                    ...state.user_preferences,
                    theme: action.payload
                },
                sample_data: state.sample_data
            }
        case UPDATE_SAMPLE_DATA:
            return {
                user_preferences: {
                    ...state.user_preferences
                },
                sample_data: action.payload
            }
        default:
            return state;
    }
}

export default rootReducer;