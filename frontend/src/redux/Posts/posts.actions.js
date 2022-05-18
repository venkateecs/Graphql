import { GETPOSTS, ADDPOSTS, DELETEPOST } from './posts.types';
import axios from 'axios';

/*export const getPosts = () => {
    return (dispatch) => {
        return axios.get(`https://jsonplaceholder.typicode.com/posts`)
            .then(response => {                
                return response.data
            })
            .then(data => {
                dispatch({ type: GETPOSTS, payload: data })
            })
            .catch(error => {
                throw (error);
            });
    };
};*/
export const getPosts = () => {
    return(dispatch)=> {
       return fetch(`https://jsonplaceholder.typicode.com/posts`)
          .then((response)=> {
             return response.json()
          }).then((data)=> {
           return dispatch({ type: GETPOSTS, payload: data });
          })
    }
    /*return function(dispatch) {
        return fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((response)=> {
           return response.json();
        }).then((data)=> {
            return dispatch({ type: GETPOSTS, payload: data })
        })
    }*/
}
export const addPosts = (posts) => {
    return {

        type: ADDPOSTS,
        payload: posts

    };

};
export const deletePost = (index) => {
    return {

        type: DELETEPOST,
        index: index

    };

};