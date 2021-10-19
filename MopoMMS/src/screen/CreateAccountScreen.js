import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, Alert} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import md5 from 'md5'
import ValueStrings from '../utils/Strings'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {checkNetwork} from '../utils/utilConfig'

class CreateAccountScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            full_name: '',
            password: '',
            confirm_password: '',
            is_stay_up_up_to_date: false,
            is_by_creating_an_account: false,
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

    setFullName(full_name){
        this.setState({
            full_name: full_name,
        })
    }

    setPassword(password){
        this.setState({
            password: password,
        })
    }

    setConfirmPassword(confirm_password){
        this.setState({
            confirm_password: confirm_password,
        })
    }

    setCheckBox1(){
        if(this.state.is_stay_up_up_to_date){
            this.setState({
                is_stay_up_up_to_date: false,
            })
        } else {
            this.setState({
                is_stay_up_up_to_date: true,
            })
        }
    }

    setCheckBox2(){
        if(this.state.is_by_creating_an_account){
            this.setState({
                is_by_creating_an_account: false,
            })
        } else {
            this.setState({
                is_by_creating_an_account: true,
            })
        }
    }

    validation(){
        if(checkNetwork()){    
            this.showAlert("please wait a moment.")
            Keyboard.dismiss;
            if(this.state.email === null || this.state.email === ""){
                this.showAlert("Please input email.")
                return;
            } else if(this.state.full_name === null || this.state.full_name === ""){
                this.showAlert("Please input full name.")
                return;
            } else if(this.state.password === null || this.state.password === ""){
                this.showAlert("Please input password.")
                return;
            } else if(this.state.confirm_password === null || this.state.confirm_password === ""){
                this.showAlert("Please input confirm password.")
                return;
            } else if(this.state.password !== this.state.confirm_password){
                this.showAlert("Password doesn't match.")
                return;
            } else if(!this.state.is_stay_up_up_to_date || !this.state.is_by_creating_an_account){
                this.showAlert("Please check box agree.")
                return;
            } else {
                this.register();
            }
        }
    }

    renderCheckBox(){
        if(Platform.OS === 'ios'){
            return <CheckBox
                value={this.state.isSelected}
                onValueChange={() => this.setCheckBox1()}
                onCheckColor={'#3C7B5E'}
                onTintColor={'#3C7B5E'}
                style={{width: 24, height: 24}}
            />
        } else {
            return <CheckBox
                value={this.state.isSelected}
                onValueChange={() => this.setCheckBox1()}
                style={styles.checkbox}
                tintColors={{ true: '#3C7B5E', false: '#3C7B5E' }}
                style={{width: 24, height: 24}}
            />
        }
    }

    renderCheckBox2(){
        if(Platform.OS === 'ios'){
            return <CheckBox
                value={this.state.isSelected}
                onValueChange={() => this.setCheckBox2()}
                onCheckColor={'#3C7B5E'}
                onTintColor={'#3C7B5E'}
                style={{width: 24, height: 24}}
            />
        } else {
            return <CheckBox
                value={this.state.isSelected}
                onValueChange={() => this.setCheckBox2()}
                style={styles.checkbox}
                tintColors={{ true: '#3C7B5E', false: '#3C7B5E' }}
                style={{width: 24, height: 24}}
            />
        }
    }

    async register () {
        try {
            let response = await fetch(
                ValueStrings.BASE_URL + ValueStrings.API_REGISTER,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: md5(this.state.password),
                        fullname: this.state.full_name,
                    })
                }
            );
            let json = await response.json();
            console.log("Quang: " + JSON.stringify(json.d));
            if(json.d !== 0){
                this.showAlert("Create account success.");
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

                            <View style={styles.viewInputText}>
                                <Image 
                                    style={{width: 24, height: 24, marginLeft: 10} }
                                    source={require('../assets/images/ic_mopo_user.png')} resizeMode="contain"
                                />
                                <TextInput 
                                    style={{width: "100%"}} 
                                    textContentType="emailAddress" 
                                    keyboardType='email-address' 
                                    onChangeText={text => this.setFullName(text)} 
                                    placeholder="Enter your full name"/>
                            </View>

                            <View style={styles.viewInputText}>
                                <Image 
                                    style={{width: 24, height: 24, marginLeft: 10} }
                                    source={require('../assets/images/ic_mopo_password.png')} resizeMode="contain"
                                />
                                <TextInput 
                                    secureTextEntry={true} 
                                    style={{width: "100%",}} 
                                    onChangeText={text => this.setPassword(text)} 
                                    placeholder="Set your password"/>
                            </View>

                            <View style={styles.viewInputText}>
                                <Image 
                                    style={{width: 24, height: 24, marginLeft: 10} }
                                    source={require('../assets/images/ic_mopo_password.png')} resizeMode="contain"
                                />
                                <TextInput 
                                    secureTextEntry={true} 
                                    style={{width: "100%",}} 
                                    onChangeText={text => this.setConfirmPassword(text)} 
                                    placeholder="Confirm your password"/>
                            </View>

                            <View style={{width: "100%",flexDirection: "row", marginTop: 10, alignSelf: "flex-start", alignItems: "center", marginTop: 15}}>
                                {this.renderCheckBox()}
                                <Text style={[styles.textContent, {marginLeft: 5}]}>Stay up to date with news and offers from the Mopo Store</Text>
                            </View>

                            <View style={{width: "100%",flexDirection: "row", marginTop: 10, alignSelf: "flex-start", alignItems: "center", marginTop: 15}}>
                                {this.renderCheckBox2()}
                                <Text style={[styles.textContent, {marginLeft: 5}]}>By creating an account, you are agreeing to our User Agreement and Privacy Policy</Text>
                            </View>

                            <TouchableOpacity style={styles.backgroundButton} onPress={() => this.validation(this.state.email, this.state.password)}>
                                <Text style={styles.textButton}>REGISTER</Text>
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

export default CreateAccountScreen