import auth from './auth';
import post from './post';
import search from './search';


import { combineReducers } from 'redux';

export default combineReducers({
    auth,
    post,
    search
});
