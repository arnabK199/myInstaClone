import React,{useState, useEffect} from 'react';
import './Styles/CreatePost.css';
import M from 'materialize-css';

const CreatePost = (props) => {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    useEffect(()=>{

        if(!url){
            return
        }

        // Creating a Post if image upload is done and the url of The image has been saved
        const data = {
            title,
            body,
            photo:url
        };

        fetch('/createpost',{
            method:'POST',
            headers:{
                'Content-Type':'Application/JSON',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error,classes:'#f44336 red'})
                console.log(props)
            }
            else{
                console.log(data)
                M.toast({html: 'Post Creation Successfull !!',classes:'#00c853 green accent-4'})
                props.history.push('/')
            }
        })
    },[url])

    const postImage = () => {
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

    return(
        <div className='card create-post'>
            <input type='text' placeholder='title' value={title} onChange={e => setTitle(e.target.value)}/>
            <input type='text' placeholder='body' value={body} onChange={e => setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Picture</span>
                    <input type="file" onChange={e => setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
                <button className='btn waves-effect waves-light #64b5f6' onClick={postImage}>Create Post</button>
            </div>
        </div>
    )
}

export default CreatePost;