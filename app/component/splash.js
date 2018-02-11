import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Splash extends Component{
    render(){
        return(
            <View style={styles.Wrapper}>
                <Text style={styles.text}>SIAGAEDU</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Wrapper : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text :{
        color: 'blue',
        fontSize: 23
    }
});