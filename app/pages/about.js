import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Button} from 'native-base';
import {NavigationActions, StackNavigator} from 'react-navigation';
import firebaseApp from '../config/Firebase';
import {tracker} from '../config/GA';

export default class about extends Component{
    static navigationOptions = {
        title: 'Tentang Si NILAI',
        headerTintColor: 'white',
        headerStyle:{
            backgroundColor: '#1F3A93'
        }
      }

    logout(){
        var {dispatch, navigate} = this.props.navigation;
        
        const reset = NavigationActions.reset({
            index:0,
            key:null,
            actions:[
                NavigationActions.navigate({
                    routeName:'SignedOut'
                })
            ]
        });

        // const reset = NavigationActions.navigate({
        //     routeName: 'SignedOut',
        //     params:{},
        //     action: NavigationActions.navigate({
        //         routeName: 'Login'
        //     })
        // })

        AsyncStorage.clear().then(()=>{
            firebaseApp.auth().signOut().then(()=>{
                dispatch(reset);
                tracker.trackEvent('Auth', 'User Loggedout')
                // alert('sukses');
            }).catch((errror)=>{
                console.log(error);
                alert(error);
            })
        })
    }
    
    render(){
        return(
            <View style={style.wrap}>
                <View style={style.innerWrap}>
                    <View style={{ alignItems: 'center', padding:10, paddingTop:25}}>
                        <Image source={require('../assets/img/blue.png')} style={style.image}/>
                        <Text>&copy; 2018 KUSIAGA</Text>
                    </View>
                    <Text style={style.text}>
                        Si NILAI adalah platform edukasi untuk mahasiswa di Indonesia berbasis cross-platform. Si NILAI dapat membantu anda untuk melakukan perhitungan target nilai perkuliahan anda.
                    </Text>
                    {/* separate 1 */}
                    <Text style={{fontWeight:'bold', paddingRight:20, paddingLeft:20, paddingTop: 10}}>
                        Versi Aplikasi
                    </Text>
                    <Text style={{fontSize:15, paddingRight:20, paddingLeft:20}}>
                        1.0.1.A
                    </Text>
                    {/* sep 2 */}
                    <Text style={{fontWeight:'bold', paddingRight:20, paddingLeft:20, paddingTop: 10}}>
                        Kolaborasi
                    </Text>
                    <Text style={{fontSize:15, paddingRight:20, paddingLeft:20}}>
                        burhanahmeed@gmail.com
                    </Text>
                </View>
                <View style={style.button}>
                    <Button block danger style={{marginTop:10, width:280, backgroundColor:'#EF4836'}} onPress={this.logout.bind(this)}>
                        <Text style={{color:'white'}}>Keluar</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    image:{height:40, width:180,},
    wrap:{flex:1, 
        // alignItems:'center', 
        // justifyContent:'center', 
        backgroundColor:'#F2F1EF'
    },
    innerWrap:{
        backgroundColor:'white',
        margin: 10, marginTop:0,
        paddingBottom: 20
    },
    text:{
        padding:10,
        paddingLeft: 20, paddingRight: 20
    },
    button:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
        bottom:10, left:0, right:0,
    },
})