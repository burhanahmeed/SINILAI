import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Picker} from 'react-native';
import Modal from 'react-native-modal';
import firebaseApp from '../config/Firebase';

export default class ModalKampusIPK extends Component{
    constructor(props){
        super(props);
        this.state = {
            amount_1:'0',
            amount_2:'0',
            amount_3:'0',
            ipk:null
        }
    }

    componentWillMount(){
        const ipsstring = this.props.itemCallback;
        if(ipsstring!=null){
            const arrayips = ipsstring.split('');
            // console.log(arrayipk[2]);
            this.setState({
                amount_1:arrayips[0],
                amount_2:arrayips[2],
                amount_3:arrayips[3]
            })
        }
    }

    _simpanTarget(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            firebaseApp.database().ref('nilai/'+user.uid).update({
                targetIPS:this.state.amount_1+'.'+this.state.amount_2+this.state.amount_3
            })
        })
        this.props.closeModalCallback();
    }

    render(){
        // if (this.state.amount_1==='4') {
        //     this.setState({amount_2:'0', amount_3:'0'})
        // }
        if (this.setState.amount_1!==null&&this.state.amount_2!==null&&this.state.amount_3!==null) {
            write = this.state.amount_1+'.'+this.state.amount_2+this.state.amount_3;            
        }else{
            write = 'Target belum ditetapkan';
        }
        return(        
                <View style={styles.modalContent}>
                    <View style={{}}>
                        <Text style={{fontWeight:'bold', color:'#1F3A93', fontSize:20}}>Target IPS</Text>      
                        <Text style={{fontSize:15}}>{write}</Text>
                    </View>
                    <View style={styles.modalPick}>
                        
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue, itemIndex) => this.setState({amount_1: itemValue})} selectedValue={this.state.amount_1}>
                            <Picker.Item label='0' value='0' />
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                        </Picker>
                        {/* {console.log(this.state.amount_1)} */}
                        <Text style={{fontSize:26, bottom:-3}}>.</Text>
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue, itemIndex) => this.setState({amount_2: itemValue})} selectedValue={this.state.amount_2}>
                            <Picker.Item label='0' value='0' />
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                            <Picker.Item label='7' value='7' />
                            <Picker.Item label='8' value='8' />
                            <Picker.Item label='9' value='9' />
                        </Picker>
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue, itemIndex) => this.setState({amount_3: itemValue})} selectedValue={this.state.amount_3}>
                            <Picker.Item label='0' value='0' />
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                            <Picker.Item label='7' value='7' />
                            <Picker.Item label='8' value='8' />
                            <Picker.Item label='9' value='9' />
                        </Picker>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text style={{color:'white', backgroundColor:'red', padding:7,paddingRight: 30,paddingLeft: 30, borderRadius:10}} onPress={()=>this.props.closeModalCallback()}>Batal</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Text style={{color:'white', backgroundColor:'#1F3A93', padding:7, paddingRight: 30,paddingLeft: 30, borderRadius:10}}  onPress={()=>this._simpanTarget()}>Simpan</Text>
                        </View>
                    </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
    },
    picker: {
        width: 80,
    },
    pickerItem: {
        
    },
    modalPick:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingBottom: 20
    }
})