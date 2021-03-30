import React,{useState} from 'react';
import './Styles/Signin.css';
import {NavLink} from 'react-router-dom';
import M from 'materialize-css';
import {connect} from 'react-redux';
import {loginUser} from '../../Store/Actions/userAction'

const Reset = (props)=>{

    const [email, setEmail] = useState('');

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const postData = () => {

        localStorage.setItem('email',email)

        if(!emailRegex.test(email)){
            M.toast({html: 'Please enter a valid Email',classes:'#f44336 red'})
            return;
        }

        fetch('/reset-password', {
            method:'POST',
            headers:{
                'Content-Type':'Application/json'
            },
            body:JSON.stringify({
                email
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:'#f44336 red'})
            }
            else{
                M.toast({html: data.message,classes:'#00c853 green accent-4'})
                props.history.push('/Signin')
            }
        })
    }

    return(
        <div className='my-card'>
            <div className='auth-card'>
                <h1 className='brand-logo'>Instagram</h1>
                <input type='text' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                <button type='submit-btn' className='submit-btn' onClick={postData}>Reset Password</button>
            </div>
        </div>
    )
}

const mapActionToProps = (dispatch) => {
    return{
        loginUser: (user) => dispatch(loginUser(user))
    }
}

export default connect(null, mapActionToProps)(Reset);