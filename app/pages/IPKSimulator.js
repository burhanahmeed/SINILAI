import React, {Component} from 'react';
import {Dimensions, View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Picker, TextInput, KeyboardAvoidingView, Keyboard, Animated} from 'react-native';
import firebaseApp from '../config/Firebase';
import Toast,{DURATION} from 'react-native-easy-toast';
import {tracker} from '../config/GA';

export default class IPKSimulator extends Component{
    static navigationOptions = {
        title: 'IPK Simulator',
        headerTintColor: '#1F3A93',
        headerStyle:{
            backgroundColor: '#F2F1EF',
            elevation:0
        }
    }
    constructor(props){
        super(props);
        this.state={
            footer:null,
            targetIPK:null,
            nilaiIPK:[{desc:'',sks:'',nilai:''}],
            showKeyboard: false,
            totalSks:'0',
            ipk:'0.00'
        }
    }
    componentWillMount(){
        this._getData();
        this.animatedYFooter = new Animated.Value(0);
    }
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>this.setState({showKeyboard:true}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this.setState({showKeyboard:false});});
    }
    _getData(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if (user!=null) {
                firebaseApp.database().ref('nilai/'+user.uid+'/detailsIPK').once('value').then((snap)=>{
                    if (snap!=null) {
                        this.setState({nilaiIPK:snap.val().details, ipk:snap.val().nilaiIPK, totalSks:snap.val().sksIPK})
                    }
                })
            }
        })
    }
    _deskripsiChange(key,text){
        const newDeskripsi = this.state.nilaiIPK.map((nilai, newkey)=>{
            if(key!==newkey) return nilai;
            return {...nilai, desc:text}
        })
        tracker.trackEvent('Fitur', 'onChange Deskripsi Field IPK');
        this.setState({nilaiIPK: newDeskripsi})
    }
    _nilaiChange(key, text){
        const textFilter = text.replace(/[^0-9 .]/g, '');
        const newNilai = this.state.nilaiIPK.map((nilai, newkey)=>{
            if(key!==newkey) return nilai;
            return {...nilai, nilai:textFilter}
        })
        this.setState({nilaiIPK:newNilai})
    }
    _sksChange(key, text){
        const textFilter = text.replace(/[^0-9]/g, '');
        const newSks = this.state.nilaiIPK.map((sks, newkey)=>{
            if(key!==newkey) return sks;
            return {...sks, sks:textFilter}
        })
        this.setState({nilaiIPK:newSks})
    }
    _addForm(){
        // const y = Dimensions.get('window').height;
        this.setState({nilaiIPK:this.state.nilaiIPK.concat([{desc:'',sks:'',nilai:''}])});
        this.refs._scroll.scrollToEnd()
        // alert(y)
    }
    _removeForm(key){
        if (this.state.nilaiIPK.length>1) {
            this.setState({nilaiIPK:this.state.nilaiIPK.filter((k, nowkey)=>key!==nowkey)});
        }else
        {this.refs.toast.show('Anda hanya memiliki satu item',DURATION.LENGTH_SHORT);}
    }
    _submitForm(){
        const {nilaiIPK} = this.state;
        var jumlahSks=0;
        var nilaiGabungan = 0;
        var generateIPK=0;
        for(var i=0;i<nilaiIPK.length;i++){        
            jumlahSks+=parseFloat(nilaiIPK[i].sks)||0;
            nilaiGabungan+=parseFloat(nilaiIPK[i].nilai)||0;
        }
        generateIPK = nilaiGabungan/nilaiIPK.length;
        var avoidNAN = isNaN(generateIPK.toFixed(2))? (0).toFixed(2):generateIPK.toFixed(2);
        this.setState({ipk:avoidNAN.toString(),totalSks: jumlahSks.toString()});
        tracker.trackEvent('Fitur', 'Calculate IPK');
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if (user!==null) {
                firebaseApp.database().ref('nilai/'+user.uid).update({
                    detailsIPK: {details: nilaiIPK, nilaiIPK:this.state.ipk, sksIPK:this.state.totalSks}
                })
            }
        })
    }
    render(){
        const IPS= (this.state.targetIPK==null||this.state.targetIPK=='')? 'Belum ada target':this.state.targetIPK;
        var IPS_style='';
        var IPS_style_Header='';
        var IPS_outter='';
        if(this.state.targetIPK==null||this.state.targetIPK==''){
            IPS_style = style.TH_cont_unsuc_txt
            IPS_style_Header = style.TH_title_unsuc;
            IPS_outter = style.topHeader_item_unsuc;
        }else if (parseFloat(this.state.targetIPK)>parseFloat(this.state.ipk)) {
            IPS_style = style.TH_cont_unsuc;
            IPS_style_Header = style.TH_title_unsuc;
            IPS_outter = style.topHeader_item_unsuc;
        }else{
            IPS_style = style.TH_cont;
            IPS_style_Header = style.TH_title;
            IPS_outter = style.topHeader_item;
        }

        const marginScrollView = (this.state.showKeyboard===true)? 0:this.state.footer;
        
        const heightForAnimation = 20+this.state.footer;
        const bottomAttributeFooter = (this.state.showKeyboard===true)?Animated.timing(this.animatedYFooter, {toValue:heightForAnimation,duration:1000}).start():Animated.timing(this.animatedYFooter, {toValue:0,duration:700}).start();

        return(
            <View style={style.wrap}><Toast ref='toast' position='top'/>
                <View style={style.topHeader}>
                    <View style={IPS_outter}>
                        <Text style={IPS_style_Header}>Target</Text>
                        <Text style={IPS_style}>{IPS}</Text>
                    </View>
                    <View style={style.topHeader_item}>
                        <Text style={style.TH_title}>SKS</Text>
                        <Text style={style.TH_cont}>{this.state.totalSks}</Text>
                    </View>
                    <View style={style.topHeader_item}>
                        <Text style={style.TH_title}>IPK</Text>
                        <Text style={style.TH_cont}>{this.state.ipk}</Text>
                    </View>
                </View>

                <ScrollView style={{marginBottom:marginScrollView}} showsVerticalScrollIndicator={false} ref='_scroll' keyboardShouldPersistTaps='always'>
                <KeyboardAvoidingView>
                    {this.state.nilaiIPK.map((n, key)=>{
                        const keys = 1+key;

                        return(
                        <View style={{flexDirection:'row', backgroundColor:'white', borderBottomColor:'white', borderBottomWidth:1, paddingTop:5, paddingBottom:10, margin:5, marginBottom:1, borderRadius:10, elevation:1}} key={key}>
                            <View style={{ flex:1,flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                <Text style={{textAlign:'center',color:'white', backgroundColor:'#1F3A93',fontSize:14, padding:6}}>{keys}</Text>
                            </View>
                            <View style={{flex:8}}>
                                <View style={{padding:4, paddingTop:0}}>
                                    <TextInput
                                    placeholder='Catatan semester'
                                    underlineColorAndroid='transparent'
                                    style={{fontSize:15, color:'grey'}}
                                    multiline={true}
                                    onChangeText={(text)=>this._deskripsiChange(key, text)}
                                    value={n.desc}/>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <View style={style.IPS_item}>
                                        <Text style={style.ips_title}>SKS</Text>
                                        <TextInput
                                        placeholder='sks'
                                        keyboardType='numeric'
                                        underlineColorAndroid='transparent'
                                        style={style.ips_cont}
                                        placeholderTextColor='#1F3A93'
                                        onChangeText={(text)=>this._sksChange(key, text)}
                                        value={n.sks}/>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={style.ips_title}>NILAI</Text>
                                        <TextInput
                                        placeholder='nilai'
                                        keyboardType='numeric'
                                        underlineColorAndroid='transparent'
                                        style={style.ips_cont}
                                        placeholderTextColor='#1F3A93'
                                        onChangeText={(text)=>this._nilaiChange(key, text)}
                                        value={n.nilai}/>
                                    </View>                            
                                </View>
                            </View>
                            <View style={{flex:1, alignItems:'center'}}>
                                <TouchableOpacity onPress={()=>this._removeForm(key)}>
                                    <Text style={{backgroundColor:'#F9690E', color:'white', textAlign:'center', fontSize:16,padding:5,width:35, height:35, borderRadius:100, marginRight:10}}>x</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )
                    })}
                </KeyboardAvoidingView>
                </ScrollView>
                <Animated.View style={{flex:1, flexDirection:'column', padding:15, position: 'absolute', left: 0, right: 0, bottom: 0, transform:[{translateY:this.animatedYFooter}], backgroundColor:'rgba(241, 240, 238, 0.72)'}} onLayout={(event)=>{var y = event.nativeEvent.layout.height; this.setState({footer:y})}}>
                    <TouchableOpacity onPress={()=>this._addForm()}>
                        <Text style={{textAlign:'center',color:'white',backgroundColor:'#049372', padding: 10, paddingLeft:15, paddingRight:15, borderRadius:5, marginTop: 10}}>Tambah</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._submitForm.bind(this)}>
                        <Text style={{textAlign:'center',color:'white',backgroundColor:'#1F3A93', padding: 10, paddingLeft:15, paddingRight:15, borderRadius:5, marginTop: 10}}>Hitung</Text>
                    </TouchableOpacity>
                </Animated.View>
                
            </View>
        )
    }
}

const style = StyleSheet.create({
    wrap:{
        backgroundColor:'#F2F1EF',
        flex: 1
    },
    topHeader:{
        flexDirection:'row',
        // marginBottom: 10       
    },
    topHeader_item:{
        flex:1,
        alignItems: 'center',
        paddingBottom: 5,
        paddingTop:5 
    },
    topHeader_item_unsuc:{
        flex:1,
        alignItems: 'center',
        backgroundColor:'#EF4836',
        paddingBottom: 5,
        paddingTop:5 
    },
    TH_title:{
        color: 'black',
        fontSize:11
    },
    TH_cont:{
        color:'#1F3A93',
        fontSize: 19,
        fontWeight:'bold'
    },
    TH_title_unsuc:{
        color: 'white',
        fontSize:11
    },
    TH_cont_unsuc:{
        color:'white',
        fontSize: 19,
        fontWeight:'bold'
    },
    TH_cont_unsuc_txt:{
        color:'white',
        fontSize: 11,
        fontWeight:'bold'
    },
    IPS_item:{
        flex:1,
        alignItems:'center'
    },
    ips_title:{
        fontSize:12
    },
    ips_cont:{
        fontSize:20,
        color:'#1F3A93',
        width:40,
        textAlign:'center'
    },
})