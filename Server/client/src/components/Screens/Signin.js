import React,{useState} from 'react';
import './Styles/Signin.css';
import {NavLink} from 'react-router-dom';
import M from 'materialize-css';
import {connect} from 'react-redux';
import {loginUser} from '../../Store/Actions/userAction'

const Signin = (props)=>{

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const postData = () => {

        localStorage.setItem('email',email)
        localStorage.setItem('password',password)

        if(!emailRegex.test(email)){
            M.toast({html: 'Please enter a valid Email',classes:'#f44336 red'})
            return;
        }

        fetch('/signin', {
            method:'POST',
            headers:{
                'Content-Type':'Application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:'#f44336 red'})
            }
            else{
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('user', JSON.stringify(data.user))
                props.loginUser(data.user ? data.user : null);
                M.toast({html: 'Sign In Successfull !!',classes:'#00c853 green accent-4'})
                props.history.push('/')
            }
        })
    }

    return(
        <div className='my-card'>
            <div className='auth-card'>
                <h1 className='brand-logo'>Instagram</h1>
                <input type='text' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                <button type='submit-btn' className='submit-btn' onClick={postData}>Log In</button>
                <NavLink to='/Signup' style={{paddingTop:'10px'}}>New to Instagram? Sign Up?</NavLink>
                <NavLink to='/reset' style={{paddingTop:'10px'}}>Forgot Password?</NavLink>
            </div>
        </div>
    )
}

const mapActionToProps = (dispatch) => {
    return{
        loginUser: (user) => dispatch(loginUser(user))
    }
}

export default connect(null, mapActionToProps)(Signin);