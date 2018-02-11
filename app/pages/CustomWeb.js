import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, WebView, Dimensions} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast';
// const cardLoop = card_data.map(cardData =>(
    
// ))
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default class CustomWeb extends Component{
    constructor(props){
        super(props);
        this.state={
            notify:''
        }
    }
    componentWillMount(){

    }

    render(){
        const {state} = this.props.navigation;
        return(
            <View style={{flex:1, flexDirection:'column'}}>
                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}><Image style={{tintColor:'white', height:25, width:25, padding:10, marginLeft:10}} source={require('../assets/icons/close.png')}/></TouchableOpacity>
                    <Text numberOfLines={1} style={{color:'white', padding:4, marginLeft:20,marginRight:10, width:deviceWidth-70}}>{state.params.url}</Text>
                </View>
            <WebView
            style={styles.webview }
            source={{uri:state.params.url}} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}/>
            </View>
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
    webview: {
        width: deviceWidth,
        height: deviceHeight
    },
    toolbar : {
        flexDirection : 'row',
        paddingTop : 20,
        paddingBottom : 10,
        backgroundColor: '#1F3A93',
        // marginTop: StatusBar.currentHeight
    }
})