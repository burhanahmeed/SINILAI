// import React, {Component} from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableHighlight,
//     Animated,
//     Dimensions
//   } from 'react-native';
  
//   let windowWidth = Dimensions.get('window').width
//   let windowHeight = Dimensions.get('window').height
  
// export default class Toast extends Component{
  
//     constructor(props){
//         super(props);
//       this.animatedValue = new Animated.Value(0)
//       this.animatedXValue = new Animated.Value(-windowWidth)
//       this.state = {
//         modalShown: false,
//         toastColor: 'green',
//         message: 'Success!'
//       }
//     }
  
//     callToast(message, type) {
//       if(this.state.modalShown) return
//       this.setToastType(message, type)
//       this.setState({ modalShown: true })
//       Animated.timing(
//         this.animatedValue,
//         {
//           toValue: 1,
//           duration: 350
//         }).start(this.closeToast())
//     }
    
//     closeToast() {
//       setTimeout(() => {
//         this.setState({ modalShown: false })
//         Animated.timing(
//         this.animatedValue,
//         { 
//           toValue: 0,
//           duration: 350
//         }).start()
//       }, 2000)
//     }
  
//     // callXToast() {
//     //   Animated.timing(
//     //     this.animatedXValue,
//     //     { 
//     //       toValue: 0,
//     //       duration: 350
//     //     }).start(this.closeXToast())
//     // }
  
//     // closeXToast() {
//     //   setTimeout(() => {
//     //     Animated.timing(
//     //     this.animatedXValue,
//     //     { 
//     //       toValue: -windowWidth,
//     //       duration: 350
//     //     }).start()
//     //   }, 2000)
//     // }
  
//     setToastType(message='Success!', type='success') {
//       let color
//       if (type == 'error') color = 'red'
//       if (type == 'primary') color = '#2487DB'
//       if (type == 'warning') color = '#ec971f'
//       if (type == 'success') color = '#1F3A93'
//       this.setState({ toastColor: color, message: message })
//     }
  
//     render() {
//         const {msgToast, typeToast} = this.props
  
//       let animation = this.animatedValue.interpolate({
//          inputRange: [0, .3, 1],
//          outputRange: [-70, -10, 0]
//        })
//        this.callToast(msgToast,typeToast);
//       return (  
//           <Animated.View  style={{ transform: [{ translateY: animation }], height: 70, backgroundColor: this.state.toastColor, position: 'absolute',left:0, top:0, right:0, justifyContent:  'center' }}>
//             <Text style={{ marginLeft: 10,  color: 'white',  fontSize:16, fontWeight: 'bold' }}>
//               { this.state.message }
//             </Text>
//           </Animated.View>          
        
//       );
//     }
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       marginTop: 70
//     },
//     buttonContainer: {
//       marginTop:10
//     }
//   });