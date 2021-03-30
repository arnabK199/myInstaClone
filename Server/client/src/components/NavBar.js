import React,{useRef, useEffect,useState} from 'react';
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {logoutUser} from '../Store/Actions/userAction';
import M from 'materialize-css';
import {Link} from 'react-router-dom';

const NavBar = props => {

    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])

    const onLogout = () => {
        localStorage.clear();
        props.onUserLogout()
        props.history.push('/Signin')
    }

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const navLinks =  () => {
        if(props.user){
            return[
                <li key='k5'><i data-target="modal1" className="large material-icons modal-trigger" style={{color:'black'}}>search</i></li>,
                <li key='k1'><NavLink to="/Profile">Profile</NavLink></li>,
                <li key='k2'><NavLink to="/Create">Create Post</NavLink></li>,
                <li key='k3'><NavLink to="/getSubscribedPosts">Followed Posts</NavLink></li>,
                <li key='k4'>
                    <button className='btn #e53935 red darken-1'onClick={onLogout} >Log Out</button>
                </li>
            ]
        }else{
            return[
                <li key='k1'><NavLink to="/Signin">Sign In</NavLink></li>,
                <li key='k2'><NavLink to="/Signup">Sign Up</NavLink></li>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)

        fetch('/search-user',{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                query
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setUserDetails(result.user)
        })
    }

    const closeModal = () => {
        const instance = M.Modal.getInstance(searchModal.current);
        setSearch('')
        instance.close()
    }

    return(
        <nav>
            <div className="nav-wrapper white">
            <NavLink to={props.user ? '/' : '/Signin'} className="brand-logo">Instagram</NavLink>
            <ul id="nav-mobile" className="right">
                {navLinks()}
            </ul>
            </div>

            {/* Modal Trigger */}
            <div id="modal1" className="modal" ref={searchModal} style={{color:'black'}}>
                <div className="modal-content">
                    <input type='text' placeholder='Search Users' value={search} onChange={e => fetchUsers(e.target.value)}/>
                    <ul class="collection">
                        {userDetails ? userDetails.map(item=>{
                            return <Link to={ item._id !== props.user._id ? '/user/' +  item._id : '/profile'} onClick={closeModal}><li class="collection-item">{item.name} - {item.email}</li></Link>
                        }) : ''}
                    </ul>
                </div>
                <div className="modal-footer">
                <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Search</button>
                </div>
            </div>
                    
        </nav>
    )
}

const mapStateToProps = state => {
    return{
        user:state.user
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onUserLogout: () => dispatch(logoutUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));