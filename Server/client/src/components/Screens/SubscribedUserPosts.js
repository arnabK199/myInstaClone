import React,{useEffect, useState} from 'react';
import './Styles/Home.css';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

const SubscribedUserPost = (props)=>{

    const [data, setData] = useState([])

    useEffect(()=>{ 
        fetch('/getsubpost', {
            method:'GET',
            headers:{
                'content-Type':'application/json',
                'Authorization':'Bearer ' + localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setData(data)
        })

    },[])

    const likePost  = (postId) => {
        console.log('Like Post clicked')
        fetch('/like',{
            method:'PUT',
            headers:{
                'content-type':'application/JSON',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId
            })
        })
        .then(res => res.json())
        .then(response=>{
            console.log(response)
            const newData = data.map(item => {
                if(item._id ===  response._id){
                    return response
                }
                return item
            })

            setData(newData)
        })
    }

    const unlikePost  = (postId) => {
        console.log('unlike post clicked')
        fetch('/unlike',{
            method:'PUT',
            headers:{
                'content-type':'application/JSON',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId
            })
        })
        .then(res => res.json())
        .then(response=>{
            console.log(response)
            const newData = data.map(item => {
                if(item._id ===  response._id){
                    return response
                }
                return item
            })

            setData(newData)
        })
    }

    const addComment = (text, postId , inputField) => {
        fetch('/comment', {
            method:'PUT',
            headers:{
                'content-type':'application/JSON',
                'Authorization':'Bearer ' + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                text,
                postId
            })
        })
        .then(res => res.json())
        .then(response=>{
            console.log(data)
            const newData = data.map(item => {
                if(item._id ===  response._id){
                    return response
                }
                return item
            })
            inputField.value = ''
            setData(newData)
        })
    }

    const deletePost = (e,postId) => {
        e.preventDefault();
        fetch(`/delete/${postId}`,{
            method:'DELETE',
            headers:{
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(deletedPost => {
            console.log(deletedPost)
            const newData = data.filter(post => {
                return post._id.toString() !== deletedPost._id.toString()
            })
            setData(newData)
        })
    }

    const deleteComment = (commentId , postId) => {

        const myData = {
            commentId
        }

        fetch(`/comment/${postId}`,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(myData)
        })
        .then(res=> res.json())
        .then(result => {
            console.log(result)
            console.log(data)

            const newData = data.map(item => {
                if(item._id ===  result._id){
                    return result
                }
                return item
            })

            setData(newData)
        })
    }

    return(
        <div className='home'>
            { data ? data.map(item => {
                return(
                    <div key = {item.title} className='card home-card'>
                        <h5 className='post-by'><Link to={item.postedBy._id == props.user._id ? '/profile' : `/user/${item.postedBy._id}`}>{item.postedBy.name} </Link>
                        {props.user._id == item.postedBy._id && <i className="material-icons" style={{float:'right'}} onClick={(e)=> deletePost(e,item._id)}>delete</i>}
                        </h5>

                        <div className='card-image'>
                            <img className='item-post' src={item.photo} alt={item.title}/>
                        </div>
                        <div className='class-content'>
                            <i className="material-icons" 
                                style={{color:'red'}}>favorite</i>
                            {item.likes.includes(props.user._id) ? 

                            <i className="material-icons" 
                            style={{padding:'5px'}}
                            onClick={()=>unlikePost(item._id)}>thumb_down</i> : 

                            <i className="material-icons" 
                                style={{padding:'5px'}}
                                onClick={()=>likePost(item._id)}>thumb_up</i>
                            }

                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>

                            {
                                item.comments.map(comment => {
                                    return(
                                    <h6 key={comment._id}><span style={{fontWeight:'500'}}>{comment.commentedBy.name}</span> {comment.text}  

                                    {comment.commentedBy._id == props.user._id ? <i className="material-icons" onClick={() => deleteComment(comment._id,item._id)}>delete</i> : ''}
                                    
                                    </h6>
                                    )
                                })
                            }

                            <form onSubmit={(e)=> {
                                e.preventDefault();
                                addComment((e.target[0].value), item._id, e.target[0])
                            }}>
                                <input type='text' placeholder='Add a comment!'/>
                            </form>
                        </div>
                    </div>
                )
            }) : 'Loading!!'}
        </div>
    )
}

const mapStateToProps = state => {
    return{
        user: state.user
    }
}

export default connect(mapStateToProps)(SubscribedUserPost);