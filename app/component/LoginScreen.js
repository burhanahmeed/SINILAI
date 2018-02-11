import React, { Component } from 'react';
import { Image, Keyboard, View, Text, StyleSheet, TextInput, KeyboardAvoidingView, AsyncStorage,ActivityIndicator, TouchableOpacity } from 'react-native';
import {Button} from 'native-base';
import {NavigationActions} from 'react-navigation';
import firebaseApp from '../config/Firebase';

export default class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            email:'',
            password:''
        }
    }
    
    login(){
        Keyboard.dismiss();
        var {dispatch, navigate} = this.props.navigation;
        this.setState({
            loading:true
        })
        
        const reset = NavigationActions.reset({
            index:0,
            key: null,
            actions:[
                NavigationActions.navigate({routeName:'SignedIn'})
            ]
        });
        // const reset = NavigationActions.navigate({
        //     routeName: 'StackOverTabs',
        //     params:{},
        //     action: NavigationActions.navigate({
        //         routeName: 'Root'
        //     })
        // })

        firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((userdata)=>{
            this.setState({loading:false})
            AsyncStorage.setItem('userdata', JSON.stringify(userdata));
            dispatch(reset);
            console.log('sukses');
        }).catch((error)=>{
            this.setState({loading:false})
            alert("Login failed. Please try again");
            console.log(error);
        })
    }

    buttonOrLoading(){
        if(this.state.loading){
            return <View style={{marginTop:10}}><ActivityIndicator size="small" color="white" /></View>
        }
        return <Button block light style={{marginTop:10, width:280, backgroundColor:'transparent', borderColor:'white', borderWidth:1}} onPress={this.login.bind(this)}>
        <Text style={{justifyContent:'center', textAlign:'center', color:'white'}}>Masuk</Text>
    </Button>
    }

    render(){
        var {navigate} = this.props.navigation;
        return(
            <View
            behavior="padding"
            style={styles.Wrapper}>
                <Image style={{width: 180, height:35}} source={require('../assets/img/logo.png')}/>
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

                <View style={{alignItems:'center'}}>
                {this.buttonOrLoading()}
                <Button block danger style={{marginTop:10, width:280, backgroundColor:'#EF4836'}} onPress={() => navigate('Signup')}>
                    <Text style={{color:'white'}}>Daftar</Text>
                </Button>
                </View>
                <TouchableOpacity onPress={()=>navigate('ResetPassword')}>
                    <Text style={{color:'white', marginTop: 10}}>Lupa password?</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputField: {
        width: 280,
        color: 'white',
        borderColor: 'white',
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
