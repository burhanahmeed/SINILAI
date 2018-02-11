import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Footer, FooterTab, Icon, Button} from 'native-base';

import Home from './pages/Home';
import Coming from './pages/Campus';
import User from './pages/User';
import FooterNav from './component/FooterNav';
import Login from './component/LoginScreen';
import Signup from './component/SignUp';
import EditUser from './component/EditUser';
import About from './pages/about';
import SettingNilai from './pages/SettingNilai';
import IPSSimulator from './pages/IPSSimulator';
import IPKSimulator from './pages/IPKSimulator';
import ResetPassword from './component/ResetPass';
import CustomWeb from './pages/CustomWeb';

export const MainScreenNavigator = TabNavigator({
    Home:{
        screen:Home
    },
    Campus:{
        screen:Coming
    },
    User:{
        screen:User
    }
},
{
    // tabBarOptions:{
    //     initialRouteName: 'Home',
    // },
    tabBarPosition:'bottom',
    animationEnabled: true,
    swipeEnabled:false,
    tabBarComponent : props=>{
        return(
            <FooterNav navigation={props.navigation} state={props.navigationState} />       
        )
    }
});

export const StackOverTabs = StackNavigator({
    Root:{
        screen:MainScreenNavigator,
        navigationOptions:{
            header:null,
        }
    },
    EditUser:{
        screen:EditUser
    },
    GotoAbout:{
        screen:About
    },
    GotoSettingNilai:{
        screen:SettingNilai
    },
    GotoIPSSimulator:{
        screen: IPSSimulator
    },
    GotoIPKSimulator:{
        screen: IPKSimulator
    },
    GotoBrowser:{
        screen:CustomWeb,
        navigationOptions:{ header:null}
    }
});

export const SignedOut = StackNavigator({
    Login:{
        screen:Login, 
            navigationOptions:{ header:null}
        
    },
    Signup:{
        screen:Signup, 
            navigationOptions:{ header:null}
    },
    ResetPassword:{
        screen:ResetPassword
    }
})

// export const ControlNavigator = StackNavigator({
//     main:{
//         screen: ({navigation, screenProps})=> <StackOverTabs screenProps={{parentNavigation, ...screenProps}}/>
//     },
//     login:{
//         screen: ({navigation, screenProps})=> <SignedOut screenProps={{parentNavigation, ...screenProps}}/>
//     }
// })

export const RootNavigator = (signedin=false)=>{
    return StackNavigator({
        SignedIn: {screen: StackOverTabs},
        SignedOut:{screen:SignedOut}
    },{
        headerMode:'none',
        mode:'modal',
        initialRouteName: signedin? 'SignedIn':'SignedOut'
    })
}