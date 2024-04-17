import {
    POST_WRITE,
    POST_WRITE_SUCCESS,
    POST_WRITE_FAILURE,
    POST_LIST,
    POST_LIST_SUCCESS,
    POST_LIST_FAILURE,
    POST_EDIT,
    POST_EDIT_SUCCESS,
    POST_EDIT_FAILURE,
    POST_REMOVE,
    POST_REMOVE_SUCCESS,
    POST_REMOVE_FAILURE,
    POST_SMILE,
    POST_SMILE_SUCCESS,
    POST_SMILE_FAILURE
} from './types';
import axios from 'axios';

/* ポストを登録　*/
export function postWriteRequest(contents) {
    return (dispatch) => {
        dispatch(postWrite());

        let jwt = localStorage.getItem('jwt');
       
        return axios.put('/api/post/', { contents }, {
            headers: {
                authorization: `Bearer ${jwt}`
            }
        })
            .then((response) => {
                dispatch(postWriteSuccess());
            })
            .catch((error) => {
                dispatch(postWriteFailure(error.response.data.code));
            });
    };
}

export function postWrite() {
    return {
        type: POST_WRITE
    };
}

export function postWriteSuccess() {
    return {
        type: POST_WRITE_SUCCESS
    };
}

export function postWriteFailure(error) {
    return {
        type: POST_WRITE_FAILURE,
        error
    };
}

/* ポストリスト取得 */

/*
    パラメーター:
    - isInitial: 初期取得
    - listType:  リストのタイプ new or old
    - id: ポストのID
    - userId:  ユーザーのID
*/
export function postListRequest(isInitial, listType, id, userId) {
    return (dispatch) => {
        dispatch(postList());
        
        let url = '/api/post';
        
        if(typeof userId === 'undefined') {
            // ポストを取得
            url = isInitial ? url : url + '/' + listType + '/' + id;
        } else {
            // ユーザーのポストを取得
            url = url + '/' + userId;
            url = isInitial ? url : url + '/' + listType + '/' + id;
        }
          
        return axios.get(url)
            .then((response) => {
                dispatch(postListSuccess(response.data, isInitial, listType));
            })
            .catch((error) => {
                dispatch(postListFailure());
            });
    };
}

export function postList() {
    return {
        type: POST_LIST
    };
}

export function postListSuccess(data, isInitial, listType) {
    return {
        type: POST_LIST_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function postListFailure() {
    return {
        type: POST_LIST_FAILURE
    };
}

/* ポスト編集 */
export function postEditRequest(id, index, contents) {
    return (dispatch) => {
        
        dispatch(postEdit());
        
        let jwt = localStorage.getItem('jwt');
        return axios.put('/api/post/' + id, { contents }, {
                headers: {
                    authorization: `Bearer ${jwt}`
                }
            })
            .then((response) => {
                dispatch(postEditSuccess(index, response.data.post));
            })
            .catch((error) => {
                dispatch(postEditFailure(error.response.data.code));
            });
    };
}

export function postEdit() {
    return {
        type: POST_EDIT
    };
}

export function postEditSuccess(index, post) {
    return {
        type: POST_EDIT_SUCCESS,
        index, 
        post
    };
}

export function postEditFailure(error) {
    return {
        type: POST_EDIT_FAILURE,
        error
    };
}

/* ポスト削除 */
export function postRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(postRemove());
        let jwt = localStorage.getItem('jwt');
        return axios.delete('/api/post/' + id, {
                headers: {
                    authorization: `Bearer ${jwt}`
                }
            })
            .then((response) => {
                dispatch(postRemoveSuccess(index));
            })
            .catch((error) => {
                dispatch(postRemoveFailure(error.response.data.code));
            });
    };
}

export function postRemove() {
    return {
        type: POST_REMOVE
    };
}

export function postRemoveSuccess(index) {
    return {
        type: POST_REMOVE_SUCCESS,
        index
    };
}

export function postRemoveFailure(error) {
    return {
        type: POST_REMOVE_FAILURE
    };
}

/* いいね */
export function postSmileRequest(id, index) {
    return (dispatch) => {
        let jwt = localStorage.getItem('jwt');
        return axios.post('/api/post/smile/' + id, {}, {
                headers: {
                    authorization: `Bearer ${jwt}`
                }
            })
            .then((response) => {
                dispatch(postSmileSuccess(index, response.data.post));
            })
            .catch((error) => {
                dispatch(postSmileFailure(error.response.data.code));
            });
    };
}


export function postSmile() {
    return {
        type: POST_SMILE
    };
}

export function postSmileSuccess(index, post) {
    return {
        type: POST_SMILE_SUCCESS,
        index,
        post
    };
}

export function postSmileFailure(error) {
    return{
        type: POST_SMILE_FAILURE,
        error
    };
}