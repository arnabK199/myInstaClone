import React, {useState, useEffect} from 'react';
import './Styles/Profile.css';
import {connect} from 'react-redux'
import {updateUser} from '../../Store/Actions/userAction';

const UserProfile = (props) =>{

    const [data, setData] = useState([])
    const [showFollow, setShowFollow] = useState(true)

    useEffect(()=>{
        fetch(`/user/${props.match.params.userId}`,{
            headers:{
                'Authorization':'Bearer '+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setData(data)
            const userId = JSON.parse(localStorage.getItem('user'))._id
            setShowFollow(!data.user.followers.includes(userId))
            // data.user.followers.map(item => {
            //     if(item == JSON.parse(localStorage.getItem('user'))._id){
            //         setShowFollow(false)
            //         return
            //     }
            // })
        })
    },[])

    const followUser = () => {
        fetch('/follow', {
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId:props.match.params.userId
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const {followers, following} = data
            localStorage.setItem('user', JSON.stringify(data))
            props.updateUser({
                followers,
                following
            })
            setData((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId:props.match.params.userId
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const {followers, following} = data
            localStorage.setItem('user', JSON.stringify(data))
            props.updateUser({
                followers,
                following
            })
            setData((prevState)=>{
                console.log(prevState)
                const newFollowers = prevState.user.followers.filter( item => item != data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return( 
        <>
        {data ? 
        <div className='container'>
        <div className='profile'>
            <div className='profile-image'>
                <img alt='profile' className='my-image' src={data.user ? data.user.pic : 'loading!'} />
            </div>
            <div className = 'profile-content'>
                <h1>{data.user ? data.user.name : 'loading'}</h1>
                <h6>{data.user ? data.user.email : 'loading'}</h6>
                <div className= 'my-info'>
                    <h6>{data.post ?data.post.length : 0} Posts</h6>
                    <h6>{data.user ? data.user.followers.length : 0} followers</h6>
                    <h6>{data.user ? data.user.following.length : 0} following</h6>
                </div>
                {showFollow ? 
                            <button type='submit-btn' className='submit-btn' onClick={followUser}>FOLLOW</button> : 
                            <button type='submit-btn' className='submit-btn' onClick={unfollowUser}>UNFOLLOW</button> }
            </div>
        </div>
        <div className='gallery'>
            {data.post ? data.post.map(item => {
                return(
                    <img key={item._id} className='item' src={item.photo} alt={item.title}/>       
                )
            }): ''}
            </div>
            
        </div>: 
        <h3>Loading ....</h3>}
        </>
        
    )
}

const mapStateToProps = state => {
    return{
        user: state.user
    }
}

const mapActionToProps = dispatch => {
    return{
        updateUser : (payload) => dispatch(updateUser(payload))
    }
}

export default connect(mapStateToProps, mapActionToProps)(UserProfile);