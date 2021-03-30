import React from 'react';
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {logoutUser} from '../Store/Actions/userAction';

const NavBar = props => {

    const onLogout = () => {
        localStorage.clear();
        props.onUserLogout()
        props.history.push('/Signin')
    }

    const navLinks =  () => {
        if(props.user){
            return[
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
    return(
        <nav>
            <div className="nav-wrapper white">
            <NavLink to={props.user ? '/' : '/Signin'} className="brand-logo">Instagram</NavLink>
            <ul id="nav-mobile" className="right">
                {navLinks()}
            </ul>
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