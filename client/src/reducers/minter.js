import { SET_MINTER_KEY } from '../actions/types';

const initialProps = {
    token: '',
}

const minter = (state = initialProps, action) => {
    switch (action.type) {
        case SET_MINTER_KEY: {
            return {
                ...state,
                token: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}

export default minter;