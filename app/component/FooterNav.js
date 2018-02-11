import React, {Component} from 'react';
import {Footer, FooterTab, Icon, Text, Button} from 'native-base';
import { StyleSheet, Image } from 'react-native';
import {NavigationActions} from 'react-navigation';
import {tracker} from '../config/GA';

export default class FooterNav extends Component{

    _goNavigate(dir, navstate){
        var state = this.props.state;
        var {navigate, dispatch} = this.props.navigation;
        if(state.index===navstate){ '' }else{ 
            navigate(dir);
            tracker.trackScreenView(dir);
        };
    }
    render(){
        var state = this.props.state;
        return(
            <Footer>
                <FooterTab style={style.bg}>
                    <Button vertical 
                            onPress={()=>this._goNavigate('Home',0)}>
                        <Image 
                            source={require('../assets/icons/home.png')}
                            style={(state.index===0)?style.img_ac:style.img} />
                        <Text style={(state.index===0)?style.text_ac:style.text}>Home</Text>
                    </Button>
                    <Button vertical 
                            onPress={()=>this._goNavigate('Campus',1)}>
                        <Image 
                            source={require('../assets/icons/ic_campus.png')}
                            style={(state.index===1)?style.img_ac:style.img} />
                        <Text style={(state.index===1)?style.text_ac:style.text}>Kampus</Text>
                    </Button>  
                    <Button vertical
                            onPress={()=>this._goNavigate('User',2)}>
                        <Image 
                            source={require('../assets/icons/ic_account.png')}
                            style={(state.index===2)?style.img_ac:style.img} />
                        <Text style={(state.index===2)?style.text_ac:style.text}>User</Text>
                    </Button>
                </FooterTab>
            </Footer>
        )
    }
}

const style = StyleSheet.create({
    bg:{
        backgroundColor: 'white',
        elevation:1
    }, 
    text:{
        color: 'grey',
        fontSize: 9
    },
    img:{
        width:30, 
        height:30, 
        tintColor:'grey'
    },
    text_ac:{
        color: '#1F3A93',
        fontSize: 9
    },
    img_ac:{
        width:30, 
        height:30, 
        tintColor:'#1F3A93'
    }
})
