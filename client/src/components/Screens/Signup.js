import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import M from 'materialize-css';

const Signup = (props)=>{

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('')
    const [url, setUrl] = useState(undefined)

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    useEffect(()=>{
        if(url){
            postFieldData()
        }
    },[url])

    const uploadPhoto = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset','insta-clone')
        data.append('cloud_name','arnabk')

        fetch('https://api.cloudinary.com/v1_1/arnabk/image/upload',{
            method:'POST',
            body:data
        })
        .then(res => res.json())
        .then(data => {
            setUrl(data.url)
        })
        .catch(err=>console.log(err))
    }

    const postFieldData = () => {

        if(!emailRegex.test(email)){
            M.toast({html: 'Please enter a valid Email',classes:'#f44336 red'})
            return;
        }

        fetch('/signup', {
            method:'POST',
            headers:{
                'Content-Type':'Application/json'
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('hello')
            if(data.error){
                M.toast({html: data.error,classes:'#f44336 red'})
                console.log(props)
            }
            else{
                M.toast({html: data.message,classes:'#00c853 green accent-4'})
                props.history.push('/Signin')
            }
        })
    }
    
    const postData = () => {
        if(image){
            uploadPhoto()
        }
        else{
            postFieldData()
        }
    }

    return(
        <div className='my-card'>
            <div className='auth-card'>
                <h1 className='brand-logo'>Instagram</h1>
                <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)}/>
                <input type='text' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn">
                        <span>UPLOAD PROFILE PICTURE</span>
                        <input type="file" onChange={e => setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button type='submit-btn' className='submit-btn' onClick={postData}>Sign Up</button>
                <NavLink to='/Signin' style={{paddingTop:'10px'}}>Already a user? Sign In?</NavLink>
            </div>
        </div>
    )
}

export default Signup;