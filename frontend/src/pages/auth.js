
import React, { Component, useState, useRef,useContext } from 'react';
import './auth.css';
import AuthContext from '../context/auth-context';

function AuthPage() {
    const [isLogin, setisLogin] = useState(true)
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const authContext = useContext(AuthContext);
    const submitHandler = (event) => {
        event.preventDefault();        
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        let requestBody = {
            query: `
        query {
            login(email: "${email}", password: "${password}"){
                userId
                token
                tokenExpiration
            }
        }
        `
        }
        if (!isLogin) {
            requestBody = {
                query: `
              mutation {
                 createUser(userInput: {email: "${email}", password:"${password}"}){
                     _id
                     email
                 }
              }
            `
            }
        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status != 200 && res.status != 201) {
                throw new Error('Failed');
            }
            return res.json()

        }).then((resData) => {
            console.log(resData);
            if (resData.data.login.token) {
                authContext.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
            }
        })
            .catch((error) => {
                console.log(error)
            })
    }
    const changeType = () => {
        setisLogin(prevState => !prevState);
    }
    return (
        <form className='auth-form' onSubmit={submitHandler}>
            <div className='form-control'>
                <label htmlFor='email'>E-Mail</label>
                <input type="email" ref={emailRef} id="email" />
            </div>            
            <div className='form-control'>
                <label htmlFor='password'>Password</label>
                <input type="password" ref={passwordRef} id="password" />
            </div>
            <h1>{isLogin}</h1>
            <div className='form-actions'>
                <button type='submit'>Submit</button>
                <button type='button' onClick={changeType}>Switch to {isLogin ? 'Signup' : 'SignIn'} </button>                
            </div>
        </form>
    )
}

export default AuthPage;