import { GETPOSTS, ADDPOSTS, DELETEPOST } from './posts.types';

const INITIAL_STATE = {
    posts:[],
    postList: []
}

const reducer = (state = INITIAL_STATE, action)=> {    
 switch(action.type) {
   case ADDPOSTS: 
    return {...state, posts: [...action.payload]}
  case GETPOSTS: 
    return {...state, postList: [...action.payload]}
  case DELETEPOST:
      const {postList} = state;
      postList.splice(action.index, 1);
    return {...state, postList: [...postList]}
  default:
    return state;
 }
}

export default reducer;