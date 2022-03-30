import { SET_MODE } from "../actions/types";

const initialState = {
    mode: '',
}

const mode = (state = initialState, action) => {
    switch (action.type) {
        case SET_MODE: {
            return {
                ...state,
                mode: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}

export default mode;