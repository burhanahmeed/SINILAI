import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, AsyncStorage, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Button} from 'native-base';
import {NavigationActions, StackNavigator} from 'react-navigation';
import firebaseApp from '../config/Firebase';
import {tracker} from '../config/GA';
// import {isSignedIn} from '../Auth';
// import {UserStack} from '../Router';

export default class User extends Component{
    constructor(props){
        super(props);
        this.state = {
            userCheck:null,
            loading:true,
            email:'',
            nama:'',
            jurusan:'',
            kampus:''
        }
    }
    getData(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            // console.log('ccuser '+user.uid+' --- '+this.state.userCheck.uid);
            if(user!=null){
                firebaseApp.database().ref('usersInfo/'+user.uid).once('value').then((snapshot)=>{
                    // console.log(snapshot.val().nama);
                    this.setState({
                        email: snapshot.val().email,
                        nama: snapshot.val().nama,
                        jurusan:snapshot.val().jurusan,
                        kampus: snapshot.val().kampus
                    })
                }).catch((err)=>{

                })
            }
        });
    }
    componentWillMount(){
        AsyncStorage.getItem('userdata').then((userdata_json)=>{
            let userdata = JSON.parse(userdata_json);
            // console.log(userdata);
            this.setState({
                loading: false,
                userCheck:userdata
            });
        }).catch((err)=>{

        })
        this.getData();    
    }

    _GotoAbout(){
        this.props.navigation.navigate('GotoAbout')
        tracker.trackEvent('User','Goto About');
        tracker.trackScreenView('About')
    }

    render(){
        //trigger data
        {this.getData()}
        var {navigate} = this.props.navigation;
        // console.log('render cek '+this.state.userCheck);
        if(this.state.userCheck==null || this.state.loading==true){
            return <View style={styles.wrapLoading}>
            <View style={{marginTop:10}}><ActivityIndicator size="large" color="#1F3A93" /></View>
        </View>
        }
        const data = [
            {
                header: 'Email',
                content: this.state.email
            },
            {
                header: 'Nama',
                content: this.state.nama
            },
            {
                header: 'Jurusan',
                content: this.state.jurusan
            },
            {
                header: 'Kampus',
                content: this.state.kampus
            },
        ]
        return(        
            <View style={styles.wrap}>
                <View style={styles.toolbar}>
                    <Text style={styles.title}>Profil</Text>
                    <TouchableOpacity onPress={this._GotoAbout.bind(this)}>
                        <Image source={require('../assets/icons/about.png')} style={{height:20, width:20, tintColor:'white', marginRight:10}}/>
                    </TouchableOpacity>
                </View>
            {data.map((prop, key)=>{
                return(
                    <View style={styles.itemView} key={key}>
                        <Text style={styles.textHeader}>{prop.header}</Text>
                        <Text style={styles.textChild}>{prop.content}</Text>
                    </View>
                )
            })}
                <View style={styles.button1}>
                    <Button block danger style={{marginTop:10, width:280, backgroundColor:'#1F3A93'}} onPress={()=> navigate('EditUser')}>
                        <Text style={{color:'white'}}>Ubah Profil</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image:{height:180, width:180},
    wrap:{flex:1, 
        // alignItems:'center', 
        // justifyContent:'center', 
        backgroundColor:'#F2F1EF'
    },
    wrapLoading:{flex:1, 
            alignItems:'center', 
            justifyContent:'center', 
            backgroundColor:'#F2F1EF'},
    itemView:{
        borderBottomColor: '#BFBFBF',
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft:10
    },
    textHeader:{
        fontSize: 17
    },
    textChild:{
        fontWeight: 'bold'
    },
    button1:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
        bottom:70, left:0, right:0,
    },
    toolbar : {
        flexDirection : 'row',
        paddingTop : 20,
        paddingBottom : 10,
        backgroundColor: '#1F3A93',
        // marginTop: StatusBar.currentHeight
    },
    title : {
        color: 'white',
        paddingLeft : 15,
        fontWeight: 'bold',
        flex:1,
        fontSize: 17
    },
})
