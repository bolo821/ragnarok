import { SET_NEWS_RT } from "../actions/types";

const initialState = {
    news: [],
}

const news = (state = initialState, action) => {
    switch (action.type) {
        case SET_NEWS_RT: {
            return {
                ...state,
                news: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}

export default news;