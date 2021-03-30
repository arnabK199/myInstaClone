import React, {Component} from 'react';
import Navbar from './components/NavBar';
import './App.css';
import {Route, Switch, withRouter} from 'react-router-dom';
import Home from './components/Screens/Home'
import Profile from './components/Screens/Profile'
import Signin from './components/Screens/Signin'
import Signup from './components/Screens/Signup'
import CreatePost from './components/Screens/CreatePost'
import UserProfile from './components/Screens/UserProfile'
import SubscribedUserPosts from './components/Screens/SubscribedUserPosts'
import {connect} from 'react-redux';
import {authStart} from './Store/Actions/userAction';

class App extends Component {
  
  componentDidMount(){

    this.props.onAppLoad();

    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      this.props.history.push('/')
    }else{
      this.props.history.push('/Signin')
    }
  }

  render(){
    return (
      <React.Fragment>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/Signin' component={Signin} />
          <Route path='/Signup' component={Signup} />
          <Route path='/Profile' component={Profile} />
          <Route path='/Create' component={CreatePost} />
          <Route path='/User/:userId' component={UserProfile} />
          <Route path='/getSubscribedPosts' component={SubscribedUserPosts} />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return{
      savedUser:state.user
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    onAppLoad :()=> {dispatch(authStart())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
