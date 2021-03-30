import React, {useState, useEffect} from 'react';
import './Styles/Profile.css';
import {connect} from 'react-redux'
import {updateProfilePic} from '../../Store/Actions/userAction'

const Profile = (props) =>{

    const [data, setData] = useState([])
    const [image, setImage ] = useState('')

    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                'Authorization':'Bearer '+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setData(data)
        })
    },[])

    useEffect(()=>{
        if(!image){
            return
        }
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
            console.log(data.url)
            // setUrl(data.url)

            updateProfileData(data)

        })
        .catch(err=>console.log(err))
    },[image])

    const updateProfileData = (data) => {

        fetch('/updateprofilepic', {
            method:'PUT',
            headers:{
                'Content-type':'Application/json',
                'Authorization':'Bearer ' + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                pic:data.url
            })
        })
        .then(res => res.json())
        .then(result=>{
            console.log(result)
            const user = JSON.parse(localStorage.getItem('user'))
            const updatedUser = {
                ...user,
                pic: result.pic
            }
            localStorage.setItem('user',JSON.stringify(updatedUser))
            props.updatePic(result.pic)
        })

    }

    const updateProfilePic = (file) => {
        setImage(file)
    }

    return( 
    <div className='container'>
        <div className='profile'>
            <div className='profile-image'>
                <img alt='profile' className='my-image' src={props.user ? props.user.pic : 'loading!'} />
            </div>
            <div className = 'profile-content'>
                <h1>{props.user ? props.user.name : 'loading'}</h1>
                <h6>{props.user ? props.user.email : 'loading'}</h6>
                <div className= 'my-info'>
                    <h6>{data ? data.length : '0'} Posts</h6>
                    <h6>{props.user ? props.user.followers.length : '0'} followers</h6>
                    <h6>{props.user ? props.user.following.length : '0'} following</h6>
                </div>
            </div>
        </div>
        <div className="file-field input-field">
            <div className="btn">
                <span>UPDATE PROFILE PICTURE</span>
                <input className='upload-input' type="file" onChange={e => updateProfilePic(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
        </div>
        <div className='gallery'>
            {data.map(item => {
                return(
                    <img key={item._id} className='item' src={item.photo} alt={item.title}/>       
                )
            })}
            </div>
    </div>
    )
}

const mapStateToProps = state => {
    return{
        user: state.user
    }
}

const mapActionToProps = dispatch => {
    return{
        updatePic : (pic)=> dispatch(updateProfilePic(pic))
    }
}

export default connect(mapStateToProps,mapActionToProps)(Profile);