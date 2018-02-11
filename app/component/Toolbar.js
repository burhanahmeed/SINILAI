import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, View } from 'react-native';


export default class Toolbar extends Component{
    render(){
        return(

            <View style={style.toolbar}>
                <StatusBar
                    backgroundColor="#1F3A93"
                    barStyle="light-content"
                />
                <Text style={style.title}>SI NILAI</Text>
                {/* <Text style={style.setting}>setting</Text> */}
            </View>
        );
    }
}


const style = StyleSheet.create({
    setting:{
        color: 'white',
        paddingRight: 10
    },
    title : {
        color: 'white',
        paddingLeft : 15,
        fontWeight: 'bold',
        flex:1,
        fontSize: 17
    },
    toolbar : {
        flexDirection : 'row',
        paddingTop : 20,
        paddingBottom : 10,
        backgroundColor: '#1F3A93',
        // marginTop: StatusBar.currentHeight
    }
});