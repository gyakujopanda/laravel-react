import * as types from 'actions/types';
import update from 'react-addons-update';

const initialState = {
    login: {
        status: 'INIT'
    },
    register: {
        status: 'INIT',
        error: {}
    },
    info: {
        status: 'INIT',
        error: {}
    },
    status: {
        isLoggedIn: false,
        currentUserId: undefined,
        currentUserName: undefined,
    }
};

export default function auth(state, action) {
    if(typeof state === 'undefined') {
        state = initialState;
    }
        
    switch(action.type) {
        /* ログイン */
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} }
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: { $set: 'SUCCESS' }
                },
                status: {
                    isLoggedIn: { $set: true },
                    currentUserId: { $set: action.userData.id },
                    currentUserName: { $set: action.userData.name }
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        /* 新規登録 */
        case types.AUTH_REGISTER:
            return update(state, {
                register: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} }
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.AUTH_REGISTER_FAILURE:
            return update(state, {
                register: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        /* ログイン状態 */
        case types.AUTH_INFO:
            return update(state, {
                info: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} }
                },
                status: {
                    isLoggedIn: { $set: true }
                }
            });
        case types.AUTH_INFO_SUCCESS:
            return update(state, {
                info: {
                    status: { $set: 'SUCCESS' }
                },
                status: {
                    currentUserId: { $set: action.userData.id },
                    currentUserName: { $set: action.userData.name }
                }
            });
        case types.AUTH_INFO_FAILURE:
            return update(state, {
                info: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                },
                status: {
                    isLoggedIn: { $set: false },
                    currentUserId: { $set: undefined },
                    currentUserName: { $set: undefined }
                }
            });
        /* ログアウト */
        case types.AUTH_LOGOUT:
            return update(state, {
                status: {
                    isLoggedIn: { $set: false },
                    currentUserId: { $set: undefined },
                    currentUserName: { $set: undefined }
                }
            });
        default:
            return state;
    }
}
