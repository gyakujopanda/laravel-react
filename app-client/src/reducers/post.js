import * as types from 'actions/types';
import update from 'react-addons-update';

const initialState = {
    write: {
        status: 'INIT',
        error: {}
    },
    list: {
        status: 'INIT',
        data: [],
        isLast: false
    },
    edit: {
        status: 'INIT',
        error: {}
    },
    remove: {
        status: 'INIT',
        error: {}
    },
    smile: {
        status: 'INIT',
        error: {}
    }
};

export default function post(state, action) {
    if(typeof state === 'undefined') {
        state = initialState;
    }

    switch(action.type) {
        case types.POST_WRITE:
            return update(state, {
                write: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} }
                }
            });
        case types.POST_WRITE_SUCCESS:
            return update(state, {
                write: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.POST_WRITE_FAILURE:
            return update(state, {
                write: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.POST_LIST:
            return update(state, {
                list: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.POST_LIST_SUCCESS: 
            if(action.isInitial) {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $set: action.data },
                        isLast: { $set: action.data.length < 6 }
                    }
                });
            } else {
                if(action.listType === 'new') {
                    return update(state, {
                        list: {
                            status: { $set: 'SUCCESS' },
                            data: { $unshift: action.data },
                        }
                    });
                } else {
                    return update(state, {
                        list: {
                            status: { $set: 'SUCCESS' },
                            data: { $push: action.data },
                            isLast: { $set: action.data.length < 6 }
                        }
                    });    
                }
                
            }
        case types.POST_LIST_FAILURE:
            return update(state, {
                list: {
                    status: { $set: 'FAILURE' }
                }
            });
        case types.POST_EDIT: 
            return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} },
                    post: { $set: undefined }
                }
            });
        case types.POST_EDIT_SUCCESS:
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' },
                },
                list: {
                    data: {
                        [action.index]: { $set: action.post }
                    }
                }
            });
        case types.POST_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.POST_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} }
                }
            });
        case types.POST_REMOVE_SUCCESS: 
            return update(state, {
                remove: {
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: { $splice: [[action.index, 1]] }
                }
            });
        case types.POST_REMOVE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.POST_SMILE:
            return update(state, {
                smile: {
                    status: { $set: 'WAITING' },
                    error: { $set: {} }
                }
            });
        case types.POST_SMILE_SUCCESS: 
            return update(state, {
                smile: {
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: {
                        [action.index]: { $set: action.post }
                    }
                }
            });
        case types.POST_SMILE_FAILURE:
            return update(state, {
                smile: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        default:
            return state;
    }
}
