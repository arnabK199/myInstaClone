import React,{useState} from 'react';
import './Styles/Signin.css';
import {NavLink} from 'react-router-dom';
import M from 'materialize-css';
import {connect} from 'react-redux';
import {loginUser} from '../../Store/Actions/userAction'

const UpdatePassword = (props)=>{

    const [password, setPassword] = useState('');

    console.log(props.match.params.token)
    const postData = () => {

        localStorage.setItem('password',password)

        fetch('/update-password', {
            method:'POST',
            headers:{
                'Content-Type':'Application/json'
            },
            body:JSON.stringify({
                password,
                token: props.match.params.token
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:'#f44336 red'})
            }
            else{
                M.toast({html: data.message ,classes:'#00c853 green accent-4'})
                props.history.push('/Signin')
            }
        })
    }

    return(
        <div className='my-card'>
            <div className='auth-card'>
                <h1 className='brand-logo'>Instagram</h1>
                <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                <button type='submit-btn' className='submit-btn' onClick={postData}>Update Password</button>
            </div>
        </div>
    )
}

const mapActionToProps = (dispatch) => {
    return{
        loginUser: (user) => dispatch(loginUser(user))
    }
}

export default connect(null, mapActionToProps)(UpdatePassword);