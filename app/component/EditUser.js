import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, AsyncStorage, ActivityIndicator, TextInput, Alert, Keyboard} from 'react-native';
import {Button} from 'native-base';
import firebaseApp from '../config/Firebase';

export default class EditUser extends Component{
    static navigationOptions = {
        title: 'Edit Profile',
        headerTintColor: 'white',
        headerStyle:{
            backgroundColor: '#1F3A93'
        }
      }
    constructor(props){
        super(props);
        this.state ={
            uid:'',
            nama:'',
            jurusan:'',
            kampus:'',
            loading:false
        }
    }
    componentWillMount(){
        const current_user = firebaseApp.auth().currentUser;
        console.log('cuser edit '+current_user);
        if(current_user!=null){
            this.setState({uid:current_user.uid});
            firebaseApp.database().ref('usersInfo/'+current_user.uid).once('value').then((snapshot)=>{
                // console.log(snapshot.val().nama);
                this.setState({
                    nama: snapshot.val().nama,
                    jurusan:snapshot.val().jurusan,
                    kampus: snapshot.val().kampus
                })
                // AsyncStorage.setItem('userinfo', JSON.stringify(snapshot.val()));
            }).catch((error)=>{

            })
        }
    }

    saveUserInfo(){
        Keyboard.dismiss();
        this.setState({
            loading:true
        })
        firebaseApp.database().ref('usersInfo/'+this.state.uid).update({
            nama:(this.state.nama!=null)?this.state.nama:'',
            jurusan:(this.state.jurusan!=null)? this.state.jurusan: '',
            kampus:(this.state.kampus!=null)?this.state.kampus:''
        }).then(()=>{
            this.setState({loading:false})
            this.props.navigation.goBack();
        }).catch((error)=>{
            this.setState({loading:false})
            Alert.alert('Error has occured','Please try again');
        })
        // console.log('uid '+this.state.uid);
    }

    render(){
        return(
            <View style={style.wrap}>
                <View style={style.wrapForm}>

                    <View style={style.form}>
                        <Text style={{color:'black'}}>Nama</Text>
                        <TextInput
                            placeholder='Nama'
                            underlineColorAndroid='grey'
                            placeholderTextColor='grey'
                            style={style.inputField}
                            onChangeText={(text)=>this.setState({nama:text})}
                            value={this.state.nama}
                            />
                    </View>
                    <View style={style.form}>
                        <Text style={{color:'black'}}>Jurusan</Text>
                        <TextInput
                            placeholder='Jurusan'
                            underlineColorAndroid='grey'
                            placeholderTextColor='grey'
                            style={style.inputField}
                            onChangeText={(text)=>this.setState({jurusan:text})}
                            value={this.state.jurusan}
                            />
                    </View>
                    <View style={style.form}>
                        <Text style={{color:'black'}}>Kampus</Text>
                        <TextInput
                            placeholder='Kampus'
                            underlineColorAndroid='grey'
                            placeholderTextColor='grey'
                            style={style.inputField}
                            onChangeText={(text)=>this.setState({kampus:text})}
                            value={this.state.kampus}
                            />
                    </View>

                    <View style={{alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
                    <Button block danger style={{marginTop:10,marginBottom: 5, width:280, backgroundColor:'#1F3A93'}} onPress={this.saveUserInfo.bind(this)}>
                        {(this.state.loading==true)? <ActivityIndicator size="small" color="white" />: <Text style={{color:'white'}}>Save</Text>}
                    </Button>
                    </View>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    inputField: {
          width: 280,
          color: 'black',
          borderColor: 'black',
          marginTop: -5
      },
    wrap:{
      flex:1,
      backgroundColor:'#F2F1EF'
    },
    wrapForm:{
        backgroundColor:'white',
        paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10
    },
    form:{
        color: 'black',
        paddingTop:5, paddingLeft:10
    }
  })