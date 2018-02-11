'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import firebaseApp from '../config/Firebase';
import Toast,{DURATION} from 'react-native-easy-toast';

export default class SettingNilai extends Component{
    static navigationOptions = {
        title: '',
        headerTintColor: '#1F3A93',
        headerStyle:{
            backgroundColor: '#F2F1EF',
            elevation:0
        }
    }
    constructor(props){
        super(props);
        this.state = {
            kriteriaNilai : [{angka:'', huruf:''}],
            loading: false
        }
    }
    componentWillMount(){
        this._getData();
    }
    _getData(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if (user!=null) {
                firebaseApp.database().ref('settingKampus/'+user.uid).once('value').then((snap)=>{
                    if (snap!=null) {
                        this.setState({kriteriaNilai:snap.val().settingNilai})
                        // console.log('cek')
                    }
                    // console.log(this.state.kriteriaNilai);
                    // console.log(snap.val().settingNilai)
                })
            }
        })
        // console.log(this.state.kriteriaNilai);
        // this.state.kriteriaNilai.map((n)=>{
        //     console.log(n.angka)
        // })
    }
    _kriteriaAngkaChange(key, textBefore){
        const text = textBefore.replace(/[^0-9 .]/g, '');
        const newKriteriaAngka = this.state.kriteriaNilai.map((kriteria, newkey)=>{
            if(key!== newkey) return kriteria;
            return {...kriteria, angka: text}
        });
        this.setState({
            kriteriaNilai:newKriteriaAngka
        })
    }
    _kriteriaHurufChange(key, text){
        // console.log('text : '+text);
        const newKriteriaHuruf = this.state.kriteriaNilai.map((kriteria, newkey)=>{
            if(key!== newkey) {return kriteria};
            return {...kriteria, huruf: text};
            // console.log((key!== newkey));
        })
        // console.log('Ker : '+newKriteriaHuruf);
        this.setState({
            kriteriaNilai:newKriteriaHuruf
        })
    }
    _addForm(){
        this.setState({kriteriaNilai: this.state.kriteriaNilai.concat([{angka:'', huruf:''}]) })
    }
    _removeForm(key){
        this.setState({kriteriaNilai: this.state.kriteriaNilai.filter((k, nowkey)=>key!==nowkey) })
    }
    _submitForm(){
        this.setState({loading:true});
        const {kriteriaNilai} = this.state;
        var settingNilai_MustBreak = false;
        var textToastError = '';
        // console.log(kriteriaNilai);
        const settingNilai = kriteriaNilai.map((k,key)=>{            
            return k;
        })
        if (kriteriaNilai.length==0) {
            settingNilai_MustBreak = true;
            textToastError='Tidak boleh kosong'
        }
        for(var i=0;i<kriteriaNilai.length;i++){
            if (kriteriaNilai[i].angka===''||kriteriaNilai[i].huruf==='') {
                settingNilai_MustBreak = true;
                textToastError='Mohon isi kolom yang kosong'
                break;
            }            
        }
        // console.log(settingNilai_MustBreak);
        // console.log(settingNilai);
        if (settingNilai_MustBreak===true) {
            this.setState({loading:false});
            this.refs.toast.show(textToastError,DURATION.LENGTH_LONG);         
        }else{
            firebaseApp.auth().onAuthStateChanged((user)=>{
                if (user!=null) {
                    firebaseApp.database().ref('settingKampus/'+user.uid).set({
                        settingNilai,email:user.email
                    }).then(()=>{this.setState({loading:false});this.refs.toast.show('Berhasil menyimpan perubahan',DURATION.LENGTH_LONG);})
                }
            })   
        }     

    }
    render(){
        // {console.log(this.state.kriteriaNilai)}
        return(
            
            <ScrollView style={style.wrap} keyboardShouldPersistTaps='always'><Toast ref='toast' position='top'/>
                <View style={style.wraptext}>
                    <Text>Sesuaikan kriteria penilaian berdasarkan kampus anda masing-masing.</Text>
                </View>
                <View style={style.wraptext}>
                    {this.state.kriteriaNilai.map((kriteria, key)=>{
                        const keys = 1+key;
                        const angkacek = kriteria.angka;
                        const hurufcek = kriteria.huruf;
                        // console.log(angkacek!=='')
                        // console.log(angkacek)
                        return(
                        <View style={style.inputtext}key={key}>
                            <TextInput
                            underlineColorAndroid='transparent'
                            style={angkacek!=='' ? style.input:style.inputWarning}
                            keyboardType='numeric'
                            placeholder={'angka #'+keys}
                            value={kriteria.angka}
                            onChangeText={(text)=>this._kriteriaAngkaChange(key, text)}/>
                            <Text style={{paddingLeft: 10, paddingRight:10, bottom:0}}> > </Text>
                            <TextInput
                            underlineColorAndroid='transparent'
                            style={hurufcek!=='' ? style.input:style.inputWarning}
                            placeholder={'huruf #'+keys}
                            value={kriteria.huruf}
                            onChangeText={(text)=>this._kriteriaHurufChange(key, text)}/>
                            <TouchableOpacity onPress={()=>this._removeForm(key)}>
                                <Text style={{color:'white',marginLeft:10, backgroundColor:'#F9690E', padding: 1, paddingLeft:15, paddingRight:15, borderRadius:5, fontSize:25}}>-</Text>
                            </TouchableOpacity>
                        </View>
                    )})}
                    <View style={{flex:1, flexDirection:'column'}}>
                        <TouchableOpacity onPress={()=>this._addForm()}>
                            <Text style={{textAlign:'center',color:'white',backgroundColor:'#049372', padding: 10, paddingLeft:15, paddingRight:15, borderRadius:5, marginTop: 10}}>Tambah</Text>
                        </TouchableOpacity>
                        {(this.state.loading==true)? <ActivityIndicator style={{marginTop:20}} size="small" color="#1F3A93" />:<TouchableOpacity onPress={this._submitForm.bind(this)}>
                            <Text style={{textAlign:'center',color:'white',backgroundColor:'#1F3A93', padding: 10, paddingLeft:15, paddingRight:15, borderRadius:5, marginTop: 10}}>Simpan</Text>
                        </TouchableOpacity>}

                    </View>
                </View>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    wrap:{
        backgroundColor:'#F2F1EF',
        flex: 1
    },
    wraptext:{
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30
    },
    inputtext:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:15
    },
    input:{
        width: 110,
        borderColor: '#1F3A93',
        borderWidth: 1,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        borderRadius: 3,
        backgroundColor: 'white',
        color: '#1F3A93'
    },
    inputWarning:{
        width: 110,
        borderColor: 'red',
        borderWidth: 2,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        borderRadius: 3,
        backgroundColor: 'white',
        color: '#1F3A93'
    }
});