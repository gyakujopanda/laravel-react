import {
    SEARCH,
    SEARCH_SUCCESS,
    SEARCH_FAILURE
} from './types';
import axios from 'axios';

export function searchRequest(keyword) {
    return (dispatch) => {
        
        dispatch(search());
        
        return axios.get('/api/auth/search/' + keyword)
            .then((response) => {
                dispatch(searchSuccess(response.data));
            })
            .catch((error) => {
                dispatch(searchFailure());
            });
    };
}

export function search() {
    return {
        type: SEARCH
    };
}

export function searchSuccess(users) {
    return {
        type: SEARCH_SUCCESS,
        users
    };
}

export function searchFailure() {
    return {
        type: SEARCH_FAILURE
    };
}