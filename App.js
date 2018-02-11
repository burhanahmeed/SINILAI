/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import {RootNavigator, MainScreenNavigator, SignedOut, StackOverTabs} from './app/Router';
import {tracker} from './app/config/GA';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      signedIn : null,
      checkedsignin: false
    }
  }
  componentWillMount(){
    AsyncStorage.getItem('userdata').then((userdata_json)=>{
      let user_data = JSON.parse(userdata_json);
      this.setState({signedIn: user_data, checkedsignin: true});
      // console.log(user_data.uid);
      
      if(user_data!=null){
        tracker.setClient(user_data.uid);
        tracker.setUser(user_data.uid);
      }
    }).catch((error)=>{
      alert("An error occurred. Please try again")
    })
  }

  render() {
    const {signedIn, checkedsignin}= this.state;
    if(!checkedsignin){
      return null;
    }

    const Layout = RootNavigator(signedIn);
    return <Layout/>;
    // return (signedIn!=null)? <StackOverTabs/> : <SignedOut/>;

  }
}

