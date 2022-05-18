import {combineReducers} from 'redux';
import counterReducer from './Counter/counter.reducer';
import postReducer from './Posts/posts.reducer';

const rootReducer =  combineReducers({
    counter:counterReducer,
    posts: postReducer
});

export default rootReducer;