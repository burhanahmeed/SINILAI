import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, BackHandler, Platform, Alert, Picker} from 'react-native';
import Modal from 'react-native-modal';
import firebaseApp from '../config/Firebase';
import {tracker} from '../config/GA';

import ModalKampusIPK from '../component/ModalKampusIPK';
import ModalKampusIPS from '../component/ModalKampusIPS';

export default class Coming extends Component{
    constructor(props){
        super(props);
        this.state = {
            modal:null,
            ipk:null,
            ips:null
        }
        // this._handleBackPress = this._handleBackPress.bind(this);
    }

    componentWillMount(){
        this._getData()
    }
    _getData(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if(user!=null){
                firebaseApp.database().ref('nilai/'+user.uid).once('value').then((snap)=>{
                    this.setState({
                        ipk: snap.val().targetIPK,
                        ips:snap.val().targetIPS
                    })
                }).catch((err)=>{
                    // alert(err)
                })
            }
        })

    }
    _modalShow = (onpress)=>{
        this.setState({modal:onpress})
    }
    _closeModal(){
        this.setState({modal:null})
    }

    render(){
        // trigger data
        {this._getData()}
        IPK = (this.state.ipk==null)? 'Contoh: 3.50':this.state.ipk;
        IPS = (this.state.ips==null)? 'Contoh: 3.50':this.state.ips;
        return(        
            <View style={styles.wrap}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('GotoSettingNilai'); tracker.trackEvent('Campus', 'Go to Setting Kriteria'); tracker.trackScreenView('Pengaturan Kriteria Nilai')}}>
                    <View style={styles.itemView}>
                        <View style={{width:'75%'}}>
                            <Text style={styles.textHeader}>Pengaturan Nilai</Text>
                            <Text style={styles.textChild}>Sesuaikan Nilai pada SiNILAI sesuai dengan standard kampus anda</Text>
                        </View>
                        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                            <Image source={require('../assets/icons/ic_right.png')} style={{tintColor:'#BFBFBF'}}/>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._modalShow(1)}>
                    <View style={styles.itemView}>
                        <View style={{}}>
                            <Text style={styles.textHeader}>Target IPK</Text>
                            <Text style={styles.textChildTarget}>{IPK}</Text>
                        </View>
                        <View style={{alignItems:'flex-end', justifyContent:'center', flex:1, paddingRight:5}}>
                            <Text style={{color:'#1F3A93',fontSize:11, borderColor: '#1F3A93', borderWidth:2, padding:7, borderRadius:10}}>Ketuk untuk mengubah</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._modalShow(2)}>
                    <View style={styles.itemView}>
                        <View style={{}}>
                            <Text style={styles.textHeader}>Target IPS</Text>
                            <Text style={styles.textChildTarget}>{IPS}</Text>
                        </View>
                        <View style={{alignItems:'flex-end', justifyContent:'center', flex:1, paddingRight:5}}>
                            <Text style={{color:'#1F3A93',fontSize:11, borderColor: '#1F3A93', borderWidth:2, padding:7, borderRadius:10}}>Ketuk untuk mengubah</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal isVisible={this.state.modal === 1} onBackButtonPress={(Platform.OS === 'android') ? ()=>this.setState({modal:null}) : PropTypes.func}>
                    <ModalKampusIPK closeModalCallback={()=>this._closeModal()} itemCallback={this.state.ipk}/>
                </Modal>
                <Modal isVisible={this.state.modal === 2} onBackButtonPress={(Platform.OS === 'android') ? ()=>this.setState({modal:null}) : PropTypes.func}>
                    <ModalKampusIPS closeModalCallback={()=>this._closeModal()} itemCallback={this.state.ips}/>
                </Modal>
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
    itemView:{
        borderBottomColor: '#F2F1EF',
        borderBottomWidth: 3,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft:10,
        backgroundColor:'white',
        flexDirection:'row'
    },
    textHeader:{
        fontSize: 17,
        fontWeight: 'bold'
    },
    textChild:{
        fontSize: 12,
    },
    textChildTarget:{
        fontSize:15,
        paddingTop:5,
    }
})