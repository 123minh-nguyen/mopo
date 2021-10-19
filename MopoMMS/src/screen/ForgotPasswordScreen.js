import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, Alert} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {checkNetwork} from '../utils/utilConfig'
import ValueStrings from '../utils/Strings'

class ForgotPasswordScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
        }
    }

    showAlert (msg) {
        Alert.alert(
            "",
            msg,
            [
              { text: "OK", onPress: () => console.log("Cancel Pressed")}
            ],
            { cancelable: false }
        );
    }

    setEmail(email){
        this.setState({
            email: email,
        })
    }

    validation(){
        
        if(checkNetwork()){
            this.showAlert("please wait a moment.")
            Keyboard.dismiss;
            if(this.state.email === null || this.state.email === ""){
                this.showAlert("Please input email.")
                return;
            } else {
                this.forgotPassword();
            }
        }
    }


    renderCheckBox(){
        if(Platform.OS === 'ios'){
            return <CheckBox
                value={this.state.isSelected}
                onValueChange={() => this.setSelection()}
                onCheckColor={'#3C7B5E'}
                onTintColor={'#3C7B5E'}
                style={{width: 24, height: 24}}
            />
        } else {
            return <CheckBox
                value={this.state.isSelected}
                onValueChange={() => this.setSelection()}
                style={styles.checkbox}
                tintColors={{ true: '#fff', false: 'fff' }}
                style={{width: 24, height: 24}}
            />
        }
    }

    async forgotPassword () {
        try {
            let response = await fetch(
                ValueStrings.BASE_URL + ValueStrings.API_PASSWORD_RESET,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                    })
                }
            );
            let json = await response.json();
            // console.log("Quang: " + JSON.stringify(json.d));
            if(json.d == 1){
                this.showAlert("Reset password success.");
            } else if(json.d == 2){
                this.showAlert("This email does not exists.");
            } else if(json.d == 3){
                this.showAlert("Reset password failed.");
            } else {
                this.showAlert("This account already exists.");
            }
          } catch (error) {
            console.error(error);
          }
    };

    render(){
        return(
            <View style={styles.content_main}>
                <KeyboardAvoidingView
                style = {{flex: 1}} 
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                enabled = {false}>
                    {/* Background image */}
                    <View style={{width: "100%", height: "100%", position: "absolute"}}>
                        <Image style={styles.image_background} source={require('../assets/images/background_mopo_2.png')} resizeMode="stretch"/>
                    </View>

                    {/* Content view */}
                    <View style={styles.content}>
                        <View style={styles.viewContent}>
                            <View style={styles.viewInputText}>
                                <Image 
                                    style={{width: 19, height: 19, marginLeft: 10, marginRight: 5} }
                                    source={require('../assets/images/ic_mopo_email.png')} resizeMode="contain"
                                />
                                <TextInput 
                                    style={{width: "100%"}} 
                                    textContentType="emailAddress" 
                                    keyboardType='email-address' 
                                    onChangeText={text => this.setEmail(text)} 
                                    placeholder="Enter your email"/>
                            </View>

                            <TouchableOpacity style={styles.backgroundButton} onPress={() => this.validation()}>
                                <Text style={styles.textButton}>RESET PASSWORD</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.contentViewBackButton}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={{width: "100%", height: "100%"}} source={require('../assets/images/ic_mopo_back.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content_main: {
        width: "100%", height: "100%",
        backgroundColor: "#ffffff"
    },

    image_background: {
        width: "100%", height: "100%",
    },

    content: {
        width: "100%",
        height: "100%",
        paddingLeft: 30,
        paddingRight: 30,
    },

    viewContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    viewInputText: {
        width: "100%", height: 45,
        flexDirection: "row", 
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 45/2,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 10,
    },

    textContent: {
        fontSize: 15,
        color: '#3C7B5E'
    },

    backgroundButton: {
        width: "100%", height: 45,
        backgroundColor: '#3C7B5E',
        borderRadius: 45/2,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 10,
    },

    textButton: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#fff',
    },

    contentViewBackButton: {
        width: 40, height: 40, 
        position: "absolute", 
        backgroundColor: "#000000A0", 
        borderColor: "#ffffffA0", 
        borderRadius: 20, 
        borderWidth: 1, 
        padding: 7, 
        marginTop: getStatusBarHeight() + 10, 
        marginLeft: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 10,
    }
})

export default ForgotPasswordScreen