import React, {Component} from 'react';
import {Dimensions, View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Picker, TextInput, KeyboardAvoidingView, Keyboard, Animated} from 'react-native';
import firebaseApp from '../config/Firebase';
import Toast,{DURATION} from 'react-native-easy-toast';
import {tracker} from '../config/GA';

export default class IPSSimulator extends Component{
    static navigationOptions = {
        title: 'IPS Simulator',
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
            nilaiHuruf:[{angka:'', huruf:''}],
            targetIPS:null,
            nilaiIPS:[{desc:'',sks:'',nilai:'', nilaiHuruf:''}],
            showKeyboard: false,
            jumlahSks:'0',
            ips:'0.00'
        }
    }
    componentWillMount(){
        this._getKriteriaNilai();
        this._getData();
        this.animatedYFooter = new Animated.Value(0);
        // tracker.trackTiming('IPS SIMULATOR page',1)
    }
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>this.setState({showKeyboard:true}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this.setState({showKeyboard:false});});
    }
    _getData(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if (user!=null) {
                firebaseApp.database().ref('nilai/'+user.uid+'/detailsIPS').once('value').then((snap)=>{
                    if (snap!=null) {
                        this.setState({nilaiIPS:snap.val().details, ips:snap.val().nilaiIPS, jumlahSks:snap.val().sksIPS})
                    }
                })
            }
        })
    }
    _getKriteriaNilai(){
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if (user!=null) {
                firebaseApp.database().ref('settingKampus/'+user.uid).once('value').then((snap)=>{
                    if (snap!=null) {
                        this.setState({nilaiHuruf:snap.val().settingNilai})
                        // console.log('cek')
                    }
                    // console.log(snap.val().settingNilai)
                })
                firebaseApp.database().ref('nilai/'+user.uid).once('value').then((snap)=>{
                    this.setState({
                        targetIPS:snap.val().targetIPS
                    })
                })
            }
        })
        // console.log(this.state.nilaiHuruf)
        // this.state.nilaiHuruf.map((nilai)=>{
        //     // var n = JSON.parse(nilai)
        //     var a = JSON.stringify(nilai)
        //     // console.log(n.angka);
        //     // console.log(a.angka);
        //     // console.log(nilai);
        // })
    }
    _deskripsiChange(key,text){
        const newDeskripsi = this.state.nilaiIPS.map((nilai, newkey)=>{
            if(key!==newkey) return nilai;
            return {...nilai, desc:text}
        })
        tracker.trackEvent('Fitur', 'onChange Deskripsi Field IPS');
        this.setState({nilaiIPS: newDeskripsi})
    }
    _nilaiChange(key, text){
        const newNilai = this.state.nilaiIPS.map((nilai, newkey)=>{
            var huruf = '';
            if(key!==newkey) return nilai;
            for(var i=0;i<this.state.nilaiHuruf.length;i++){
                if (text===this.state.nilaiHuruf[i].angka) {
                    huruf = this.state.nilaiHuruf[i].huruf
                    break;
                }
            }
            return {...nilai, nilai:text, nilaiHuruf:huruf}
        })
        this.setState({nilaiIPS:newNilai})
    }
    _sksChange(key, text){
        const textFilter = text.replace(/[^0-9]/g, '');
        const newSks = this.state.nilaiIPS.map((sks, newkey)=>{
            if(key!==newkey) return sks;
            return {...sks, sks:textFilter}
        })
        this.setState({nilaiIPS:newSks})
    }
    _addForm(){
        // const y = Dimensions.get('window').height;
        this.setState({nilaiIPS:this.state.nilaiIPS.concat([{desc:'',sks:'',nilai:''}])});
        this.refs._scroll.scrollToEnd()
        // alert(y)
    }
    _removeForm(key){
        if (this.state.nilaiIPS.length>1) {
            this.setState({nilaiIPS:this.state.nilaiIPS.filter((k, nowkey)=>key!==nowkey)});
        }else
        {this.refs.toast.show('Anda hanya memiliki satu item',DURATION.LENGTH_SHORT);}
    }
    _submitForm(){
        const {nilaiIPS} = this.state;
        var jumlahSks=0;
        var nilaiGabungan = 0;
        var generateIPS=0;
        for(var i=0;i<nilaiIPS.length;i++){        
            jumlahSks+=parseFloat(nilaiIPS[i].sks)||0;
            nilaiGabungan+=(parseFloat(nilaiIPS[i].nilai)||0)*(parseFloat(nilaiIPS[i].sks)||0);
        }
        generateIPS = nilaiGabungan/jumlahSks;
        var avoidNAN = isNaN(generateIPS.toFixed(2))? (0).toFixed(2):generateIPS.toFixed(2);
        this.setState({ips:avoidNAN.toString(),jumlahSks: jumlahSks.toString()});
        tracker.trackEvent('Fitur', 'Calculate IPS');
        firebaseApp.auth().onAuthStateChanged((user)=>{
            if (user!==null) {
                firebaseApp.database().ref('nilai/'+user.uid).update({
                    detailsIPS: {details: nilaiIPS, nilaiIPS:this.state.ips, sksIPS:this.state.jumlahSks}
                })
            }
        })
    }
    render(){
        const IPS= (this.state.targetIPS==null||this.state.targetIPS=='')? 'Belum ada target':this.state.targetIPS;
        var IPS_style='';
        var IPS_style_Header='';
        var IPS_outter='';
        if(this.state.targetIPS==null||this.state.targetIPS==''){
            IPS_style = style.TH_cont_unsuc_txt
            IPS_style_Header = style.TH_title_unsuc;
            IPS_outter = style.topHeader_item_unsuc;
        }else if (parseFloat(this.state.targetIPS)>parseFloat(this.state.ips)) {
            IPS_style = style.TH_cont_unsuc;
            IPS_style_Header = style.TH_title_unsuc;
            IPS_outter = style.topHeader_item_unsuc;
        }else{
            IPS_style = style.TH_cont;
            IPS_style_Header = style.TH_title;
            IPS_outter = style.topHeader_item;
        }
        const pickerI = this.state.nilaiHuruf.map((nilai)=>{
            // const n = JSON.parse(nilai);
            return(
            <Picker.Item label={nilai.huruf} value={nilai.angka}/>  
            // console.log(nilai)  
            )
        });
        pickerI.unshift(<Picker.Item label='Pilih' value='' />)

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
                        <Text style={style.TH_cont}>{this.state.jumlahSks}</Text>
                    </View>
                    <View style={style.topHeader_item}>
                        <Text style={style.TH_title}>IPS</Text>
                        <Text style={style.TH_cont}>{this.state.ips}</Text>
                    </View>
                </View>

                <ScrollView style={{marginBottom:marginScrollView}} showsVerticalScrollIndicator={false} ref='_scroll' keyboardShouldPersistTaps='always'>
                <KeyboardAvoidingView>
                    {this.state.nilaiIPS.map((n, key)=>{
                        const keys = 1+key;

                        return(
                        <View style={{flexDirection:'row', backgroundColor:'white', borderBottomColor:'white', borderBottomWidth:1, paddingTop:5, paddingBottom:10, margin:5, marginBottom:1, borderRadius:10, elevation:1}} key={key}>
                            <View style={{ flex:1,flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                <Text style={{textAlign:'center',color:'white', backgroundColor:'#1F3A93',fontSize:14, padding:6}}>{keys}</Text>
                            </View>
                            <View style={{flex:8}}>
                                <View style={{padding:4, paddingTop:0}}>
                                    <TextInput
                                    placeholder='Deskripsi atau catatan'
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
                                        <Picker textStyle={style.ips_cont} style={{textAlign:'center',width:'90%', color:'#1F3A93',}} itemStyle={{}} onValueChange={(itemValue, index)=>{this._nilaiChange(key,itemValue);Keyboard.dismiss()}} selectedValue={n.nilai}>     
                                        {pickerI}
                                        </Picker>
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