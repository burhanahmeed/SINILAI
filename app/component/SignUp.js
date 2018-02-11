import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, ActivityIndicator, Keyboard } from 'react-native';
import {Button} from 'native-base';
import { NavigationActions } from 'react-navigation';

import firebaseApp from '../config/Firebase';
import * as firebase from 'firebase';
import {tracker} from '../config/GA';

// const app = FirebaseApp;

// const firebaseConfig = {
//     apiKey: "AIzaSyAo-TdgxPHOPW1lOh3pZt1GP5SP3JZBTBY",
//     authDomain: "kusiaga-165202.firebaseapp.com",
//     databaseURL: "https://kusiaga-165202.firebaseio.com",
//     projectId: "kusiaga-165202",
//     storageBucket: "kusiaga-165202.appspot.com",
//     messagingSenderId: "964118721025"
//   };

// !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default class SignUp extends Component{

    constructor(props){
        super(props);
        this.state = {
            loaded:true,
            email:'',
            password:'',
            // cpassword:''                                                                                    
        };
        // this._addSettingNilaiDefault = this._addSettingNilaiDefault.bind(this);
    }

    // componentWillMount(){
    //     const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    //  }

    renderButtonOrLoading() {
        if (this.state.loaded==false) {
            return <View style={{marginTop:10}}><ActivityIndicator size="small" color="white" /></View>
        }
        return <Button block light style={{marginTop:10, width:280, backgroundColor:'transparent', borderColor:'white', borderWidth:1}} onPress={this.signup.bind(this)}>
        <Text style={{justifyContent:'center', textAlign:'center', color:'white'}}>Daftar</Text>
    </Button>;
    }

    // _addSettingNilaiDefault(uid){
    //     const dataArray = [{angka:'4', huruf:'A'}, {angka:'3.5', huruf:'AB'}, {angka:'3', huruf:'B'}, {angka:'2.5', huruf:'BC'}, {angka:'2', huruf:'C'},{angka:'1', huruf:'D'}, {angka:'0', huruf:'E'}];
    //     const settingNilai = dataArray.map((k)=>{
    //         return k;
    //     })
    //     firebaseApp.database().ref('settingKampus/'+uid).set({
    //         settingNilai
    //     })
    // }

    signup(){
        Keyboard.dismiss();
        var {dispatch, navigate} = this.props.navigation;
        this.setState({                                                                                          
            loaded:false
        });

        // console.log(firebaseApp.name);
        // console.log(app.database());
        const reset = NavigationActions.reset({
            index:0,
            actions:[
                NavigationActions.navigate({routeName:'Login'})
            ]
        });
        
        // call to firebase to make new user
        firebaseApp.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
        .then(function(user){
            // console.log('sukses');
            alert('Your account was created!');
            dispatch(reset); 
            tracker.trackEvent('Auth','Succesfully Signedup')

            firebaseApp.database().ref('usersInfo/'+ user.uid).set({
                email: user.email
            });
            // console.log(user.uid);
            // const anyID = user.uid;
            // ()=>{this._addSettingNilaiDefault(anyID)};
            const dataArray = [{angka:'4', huruf:'A'}, {angka:'3.5', huruf:'AB'}, {angka:'3', huruf:'B'}, {angka:'2.5', huruf:'BC'}, {angka:'2', huruf:'C'},{angka:'1', huruf:'D'}, {angka:'0', huruf:'E'}];
            const settingNilai = dataArray.map((k)=>{
                return k;
            })
            firebaseApp.database().ref('settingKampus/'+user.uid).set({
                settingNilai
            })
        }).catch((error)=>{
            this.setState({                                                                                      
                loaded:true
            });
            // Handle Errors here.
            // var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            // console.log(errorMessage);
        });
    }

    render(){
        return(
            <View
            behavior="padding"
            style={styles.Wrapper}>
                <Text style={{fontSize:23, color:'white'}}>Daftar</Text>
                <TextInput
                placeholder='email'
                underlineColorAndroid='white'
                placeholderTextColor='white'
                keyboardType='email-address'
                style={styles.inputField}
                onChangeText={(text)=> this.setState({email:text})}
                value={this.state.email}/>

                <TextInput
                placeholder='password'
                underlineColorAndroid='white'
                placeholderTextColor='white'
                secureTextEntry={true}
                style={styles.inputField}
                onChangeText={(text)=> this.setState({password:text})}
                value={this.state.password}/>
                {/* <TextInput
                placeholder='confirm password'
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                style={styles.inputField}
                onChangeText={(text)=> this.setState({cpassword:text})}
                value={this.state.cpassword}/> */}

                <View style={{alignItems:'center'}}>
                    {this.renderButtonOrLoading()}
                </View>
                <View>
                    <Text style={{color:'white', fontSize: 14, marginTop:10}} onPress={() => this.props.navigation.goBack()}>Kembali</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputField: {
        width: 280,
        color: 'white',
        marginTop: 5
    },
    Wrapper : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F3A93'
    },
    text :{
        color: 'blue',
        fontSize: 23
    }
});

