import * as types from 'actions/types';
import update from 'react-addons-update';

const initialState = {
    status: 'INIT',
    users: []
};

export default function search(state, action) {
    if(typeof state === 'undefined') {
        state = initialState;
    }

    switch(action.type) {
        case types.SEARCH:
            return update(state, {
                status: { $set: 'WAITING' }
            });
        case types.SEARCH_SUCCESS:
            return update(state, {
                status: { $set: 'SUCCESS' },
                users: { $set: action.users }
            });
        case types.SEARCH_FAILURE:
            return update(state, {
                status: { $set: 'FAILURE' },
                users: []
            });
        default:
            return state;
    }
}
