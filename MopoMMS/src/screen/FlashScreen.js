import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5'
import ValueStrings from '../utils/Strings'
import {addAccountInfo} from '../actions/action_home'

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class FlashScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            isConnected: false,
        }
        this.countDownTime();
        this.checkAutoLogin();
    }

    countDownTime(){
        setTimeout(() => {
            if(this.state.isConnected){
                this.props.navigation.replace('Home')
            } else {
                this.props.navigation.replace('Login')
            } 
        }, 3000);
    }

    checkAutoLogin(){
        try {
            AsyncStorage.getItem(ValueStrings.key_is_login).then((value) => {
                let preLoginInfo = JSON.parse(value)
                if(preLoginInfo != null && preLoginInfo != undefined){
                    if(preLoginInfo.isLogin){
                        this.autologin();
                    }
                }
            }).catch(e => {
                return e;
            });
        } catch (error) {
        }
    }

    autologin(){
        try {
            AsyncStorage.getItem(ValueStrings.key_pre_login).then((value) => {
                let preLoginInfo = JSON.parse(value)
                if(preLoginInfo != null && preLoginInfo != undefined){
                    this.login(preLoginInfo.email, md5(preLoginInfo.password), preLoginInfo.isSelected);
                }
            }).catch(e => {
                return e;
            });
        } catch (error) {
        }
    }

    async login (emails, passwords, isSelected) {
        try {
            let response = await fetch(
                ValueStrings.BASE_URL + ValueStrings.API_LOGIN,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emails,
                        password: passwords,
                    })
                }
            );
            let json = await response.json();
            if(json.d.Code === 1){
                this.props.addAccountInfo({
                    UserID: json.d.UserID,
                    Email: json.d.Email,
                    Phone: json.d.Phone,
                    Address: json.d.Address,
                    FullName: json.d.FullName,
                    LoginID: json.d.LoginID,
                    BirthDay: json.d.BirthDay,
                    Avatar: json.d.Avatar,
                    Gender: json.d.Gender,
                    CustomerType_ID: json.d.CustomerType_ID,
                })

                this.setState({
                    isConnected: true,
                })

            } else if(json.d.Code === 2){
                console.log("The password is incorrect");
            } else if(json.d.Code === 3){
                console.log("This account is inactive");
            } else {
                console.log("This account does not exist");
            }
          } catch (error) {
            console.error(error);
          }
    };

    render(){
        return(
            <View style={styles.content_main}>
                <View style={{flexDirection: "column", width: '100%', height: '100%', position: 'absolute'}}>
                    <Image style={{width: "100%", height: '100%'}} source={require('../assets/images/background_mopo_bottom.png')} resizeMode="stretch"/>
                </View>

                <View style={{flexDirection: "column", width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'absolute'}}>
                    <Text style={{fontSize: 12, color: "#3C7B5E", marginBottom: 3, marginRight: 3}}>{ValueStrings.version_app}</Text>
                </View>
                
                <View style={styles.content_view_body}>

                    <View style={{width: "100%", height: "100%", position: "absolute", justifyContent: "space-between", alignItems: "center"}}>
                        <View style={{width: "100%", height: 50, alignItems: "center", marginTop: "15%"}}>
                            <Image style={{width: 250, height: "100%"}} source={require('../assets/images/logo_app.png')} resizeMode="contain"/>
                        </View>

                        <View style={{width: "100%", height: 50, alignItems: "center", marginBottom: "20%"}}>
                            <Text style={{fontSize: width_window * 0.05, fontWeight: "bold", color: "#3C7B5E"}}>SMART SOLUTION</Text>
                            <Text style={{fontSize: width_window * 0.04, color: "#3C7B5E"}}>For Enviromental Protection</Text>
                        </View>
                    </View>

                    <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                        <Image style={{width: "100%", height: "43%"}} source={require('../assets/images/background_screen.png')} resizeMode="contain"/>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content_main: {
        width: '100%', height: '100%',
        backgroundColor: "#fff",
        alignItems: 'center'
    },

    content_view_body: {
        flexDirection: "column",
        width: width_window * 0.8, height: height_window,
        marginLeft: 20,
        marginRight: 20,
    },

    image_background: {
        width: "100%", height: "100%",
    },
})

const mapDispatchToProps = dispatch => ({
    addAccountInfo: (obj) => dispatch(addAccountInfo(obj)),
})

export default connect(null, mapDispatchToProps)(FlashScreen);

