import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_INFO,
    AUTH_INFO_SUCCESS,
    AUTH_INFO_FAILURE,
    AUTH_LOGOUT
} from './types';
import axios from 'axios';

/* ログイン */
export function loginRequest(email, password) {
    return (dispatch) => {
        dispatch(login());
        return axios.post('/api/auth/login', { email, password })
            .then((response) => {
                dispatch(loginSuccess(response.data));
                localStorage.setItem('jwt', response.data.token);
            })
            .catch((error) => {
                dispatch(loginFailure(error.response.data));
            });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(userData) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        userData
    };
}

export function loginFailure(error) {
    return {
        type: AUTH_LOGIN_FAILURE,
        error
    };
}

/* 新規登録 */
export function registerRequest(email, name, password) {
    return (dispatch) => {
        dispatch(register());

        return axios.post('/api/auth/register', { email, name, password }, {
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then((response) => {
                dispatch(registerSuccess());
                localStorage.setItem('jwt', response.data.token);
            })
            .catch((error) => {
                dispatch(registerFailure(error.response.data));
            });
    };
}

export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}

export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}

/* ログイン状態 */
export function infoRequest() {
    return (dispatch) => {
        dispatch(infoStatus());
        let jwt = localStorage.getItem('jwt');
        return axios.get('/api/auth/info', {
                headers: {
                    authorization: `Bearer ${jwt}`
                }
            })
            .then((response) => {
                dispatch(infoSuccess(response.data));
            })
            .catch((error) => {
                localStorage.removeItem('jwt');
                dispatch(infoFailure(error.response.data));
            });
    };
}

export function infoStatus() {
    return {
        type: AUTH_INFO
    };
}

export function infoSuccess(userData) {
    return {
        type: AUTH_INFO_SUCCESS,
        userData
    };
}

export function infoFailure(error) {
    return {
        type: AUTH_INFO_FAILURE,
        error
    };
}

/* ログアウト */
export function logoutRequest() {
    return (dispatch) => {
        let jwt = localStorage.getItem('jwt');
        return axios.post('/api/auth/logout', {}, {
                headers: {
                    authorization: `Bearer ${jwt}`
                }
            })
            .then((response) => {
                localStorage.removeItem('jwt');
                dispatch(logout());
            });
    };
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
