import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right} from 'native-base';
import Toast,{DURATION} from 'react-native-easy-toast';
import Toolbar from '../component/Toolbar';
import firebaseApp from '../config/Firebase';
import {tracker} from '../config/GA';
// const cardLoop = card_data.map(cardData =>(
    
// ))

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            notify:''
        }
    }
    componentWillMount(){
        firebaseApp.database().ref('manualNotification').once('value').then((snap)=>{
            if (snap!=null) {
                this.setState({notify:snap.val().notify})
            }
        })
        tracker.trackScreenView('Home Start Page');
        tracker.createNewSession('Home')
    }
    _gotoPage(target){
        const {navigate} = this.props.navigation;
        // alert(target)
        navigate(target);
        tracker.trackEvent('Fitur', target);
    }
    _gotoUnavailable(){
        this.refs.toast.show('Fitur belum tersedia',DURATION.LENGTH_SHORT)
        // var a =this.state.notify.sort((a,b)=>(b.no-a.no));
        // {console.log(this.state.notify=='')}
        // if (this.state.notify!=null) {
        //     var notif = this.state.notify[this.state.notify.length-1];    
        // }
        // {console.log(this.state.notify!=null)}
        // {console.log(notif)}
        tracker.trackEvent('Fitur', 'Matakuliah Simulator');
    }
    render(){
        const card_data = [
            {
                img:require("../assets/icons/ipk.png"),
                titleName: 'IPK Simulator',
                action: ()=>this._gotoPage('GotoIPKSimulator')
            },
            {
                img:require('../assets/icons/ips.png'),
                titleName:'IPS Simulator',
                action: ()=>this._gotoPage('GotoIPSSimulator')
            },
            {
                img:require("../assets/icons/matkul.png"),
                titleName:'Matakuliah Simulator',
                action: ()=>this._gotoUnavailable()
            }
        ];
        if (this.state.notify!=null) {
            var notif = this.state.notify[this.state.notify.length-1];    
        }
        const isShown = (this.state.notify==null||this.state.notify=='')?<View/>:            
        <View>
            <TouchableOpacity style={{bottom:20, right:20,position:'absolute'}} onPress={()=>{this.props.navigation.navigate('GotoBrowser', {url:notif.link}); tracker.trackEvent('ManualNotification', notif.btnTitle, notif.link)}}>
                <View style={{flexDirection:'row', backgroundColor:'#16a085', padding:5, borderRadius:20,elevation: 15}}>
                    <Text style={{justifyContent:'center', color:'white', paddingTop:7, paddingLeft:10}}>{notif.btnTitle}
                    </Text>
                    <Image style={{tintColor:'white'}} source={require('../assets/icons/ic_right.png')}/>
                </View>
            </TouchableOpacity>
        </View>;
        return(        
        <Container><Toast ref='toast' position='top'/>
            <Toolbar />
            <Content style={{backgroundColor:'#F2F1EF'}}>
            {/* <Text style={styles.warn}>This app is still under development, may be unstable on your phone</Text> */}
            <View style={{flexDirection: 'row', flexWrap:'wrap', alignItems:'center', justifyContent: 'center',}}>
                {card_data.map((prop, key)=>{
                    // const imgstring = "'"+prop.img+"'";
                    // const imgs = require(imgstring);
                    // console.log(imgs);
                    return(
                    <TouchableOpacity onPress={prop.action} key={key}>
                        <View style={styles.cardOutter}>
                            <View cardBody style={{alignItems: 'center',justifyContent:'center', paddingTop:10}}>
                            <Image source={prop.img} style={{height: 30,width:30, tintColor:'#6C7A89' }}/>
                            </View>
                            <View >
                            <Body style={styles.wrap}>
                                <Text style={styles.subtitle}>{prop.titleName}</Text>
                            </Body>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )
                })}
                </View>
            </Content>
                {isShown}
        </Container>
        )
    }
}

const styles = StyleSheet.create({
    subtitle:{
        fontSize: 11,
        textAlign: 'center'
    }, 
    wrap:{
        alignItems:'center',
        flex:1
    },
    cardOutter:{
        borderColor: '#F2F1EF',
        borderWidth: 0.8,
        width: 120,
        height: 120,
        justifyContent: 'center',
        backgroundColor:'white'
    },
    warn:{
        paddingLeft:10, 
        paddingRight:10,
        paddingBottom: 5,
        paddingTop:5,
        marginBottom:5, 
        backgroundColor:'#F5D76E'
    }
})