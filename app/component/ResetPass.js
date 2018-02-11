import React, { Component } from 'react';
import {Keyboard, View, Text, StyleSheet, TextInput,ActivityIndicator, Alert } from 'react-native';
import {Button} from 'native-base';
import {NavigationActions} from 'react-navigation';
import firebaseApp from '../config/Firebase';

export default class ResetPasssword extends Component{
    static navigationOptions = {
        title: '',
        headerTintColor: '#F2F1EF',
        headerStyle:{
            backgroundColor: '#1F3A93',
            elevation:0
        }
    }

    constructor(props){
        super(props);
        this.state = {
            loading:false,
            email:'',
        }
    }
    
    send(){
        this.setState({
            loading:true
        })
        Keyboard.dismiss();
        if (this.state.email==='') {
            this.setState({
                loading:false
            })
            Alert.alert('Terjadi Error','Kolom tidak boleh kosong');
        }else{
            firebaseApp.auth().sendPasswordResetEmail(this.state.email).then((r)=>{
                Alert.alert('Berhasil','silahkan cek email anda untuk mereset password');
                this.setState({
                    loading:false,
                    email:''
                })
            }).catch((e)=>{
                Alert.alert('Terjadi Error',e);
                this.setState({
                    loading:false,
                })
            })
        }
    }

    buttonOrLoading(){
        if(this.state.loading){
            return <View style={{marginTop:10}}><ActivityIndicator size="small" color="white" /></View>
        }
        return <Button block light style={{marginTop:10, width:280, backgroundColor:'transparent', borderColor:'white', borderWidth:1}} onPress={this.send.bind(this)}>
        <Text style={{justifyContent:'center', textAlign:'center', color:'white'}}>Reset Password</Text>
    </Button>
    }

    render(){
        var {navigate} = this.props.navigation;
        return(
            <View
            behavior="padding"
            style={styles.Wrapper}>
                <Text style={{color:'white', fontSize:25, fontWeight:'bold'}}>Lupa Password?</Text>
                <Text style={{color:'white', fontSize:11}}>Masukkan email yang terdaftar pada SiNILAI</Text>
                <TextInput
                placeholder='masukkan alamat email'
                underlineColorAndroid='white'
                placeholderTextColor='white'
                keyboardType='email-address'
                style={styles.inputField}
                onChangeText={(text)=> this.setState({email:text})}
                value={this.state.email}/>

                <View style={{alignItems:'center'}}>
                {this.buttonOrLoading()}
                </View>
                {/* <Text style={{color:'white', marginTop: 10}}>Forgot your password?</Text> */}
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
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: '#1F3A93'
    },
    text :{
        color: 'blue',
        fontSize: 23
    }
});
