import { SET_CHARACTERS } from '../actions/types';

const initialState = {
    characters: [],
}

const character = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHARACTERS: {
            return {
                ...state,
                characters: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}

export default character;