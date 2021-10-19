import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, Alert, Platform, NetInfo} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import {connect} from 'react-redux'
import md5 from 'md5'
import ValueStrings from '../utils/Strings'
import {setAsyncStorage} from '../utils/AsyncStorageModel'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addAccountInfo, set_page_screen, set_quik_app, setMultiBMS} from '../actions/action_home'
import {checkNetwork} from '../utils/utilConfig'

const width_window = Dimensions.get('window').width;

class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            isSelected: false,
        }
    }

    componentDidMount() {
        this.setEmail("");
        this.setPassword("");
        this.checkIsSelected();
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

    setEmail(mail){
        this.setState({
            email: mail,
        })
    }

    setPassword(pass){
        this.setState({
            password: pass,
        })
    }

    setSelection(){
        if(this.state.isSelected){
            this.setState({
                isSelected: false,
            })
        } else {
            this.setState({
                isSelected: true,
            })
        }
    }

    checkIsSelected(){
        try {
            AsyncStorage.getItem(ValueStrings.key_pre_login).then((value) => {
                let preLoginInfo = JSON.parse(value)
                if(preLoginInfo != null && preLoginInfo != undefined){
                    this.setState({
                        email: preLoginInfo.email,
                        password: preLoginInfo.password,
                        isSelected: preLoginInfo.isSelected,
                    })
                }
            }).catch(e => {
                return e;
            });
        } catch (error) {
        }
    }

    clickUsingQuikApp(){
        setAsyncStorage(ValueStrings.key_is_connect_multi, JSON.stringify({isMulti: false}));
        this.props.set_quik_app(true);
        this.props.set_page_screen(1);
        this.props.navigation.replace('Home');
    }

    validation(emails, passwords){
        if(checkNetwork()){
            Keyboard.dismiss;
            if(emails === null || emails === ""){
                this.showAlert("Please input email.")
                return;
            } else if(passwords === null || passwords === ""){
                this.showAlert("Please input password.")
                return;
            } else {
                this.login(emails, passwords);
            }
        }
    }

    async login (emails, passwords) {
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
                        password: md5(passwords),
                    })
                }
            );
            let json = await response.json();
            if(json.d.Code === 1){
                if(this.state.isSelected){
                    setAsyncStorage(ValueStrings.key_pre_login, JSON.stringify({isSelected: true, email: emails, password: passwords}))
                } else {
                    setAsyncStorage(ValueStrings.key_pre_login, JSON.stringify({isSelected: false, email: '', password: ''}))
                }

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
                setAsyncStorage(ValueStrings.key_is_login, JSON.stringify({isLogin: true}))
                this.props.set_page_screen(1);
                this.props.navigation.replace('Home');
            } else if(json.d.Code === 2){
                this.showAlert("The password is incorrect");
            } else if(json.d.Code === 3){
                this.showAlert("This account is inactive");
            } else {
                this.showAlert("This account does not exist");
            }
        } catch (error) {
            console.log( "Login: " + error);
            if(("" + error).indexOf('Network request failed') > 0){
                this.showAlert("Server not respoint.")
            }
        }
    };

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
                tintColors={{ true: '#3C7B5E', false: '#3C7B5E' }}
                style={{width: 24, height: 24}}
            />
        }
    }

    render(){
        return(
            <>
                <View style={styles.content_main}>
                    <KeyboardAvoidingView
                    style = {{flex: 1, width: "100%", height: "100%",}} 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    enabled = {false}>
                        
                        
                        <View style={{width: "100%", height: "100%", position: "absolute"}}>
                            <Image style={styles.image_background} source={require('../assets/images/background_mopo_2.png')} resizeMode="stretch"/>
                        </View>
                        
                        
                        <View style={styles.content}>
                            <View style={styles.viewContent}>
                                <Text style={styles.textHeader}>Well come to Mopo!</Text>
                                <Text style={styles.textContent}>Sign in to Mopo App with Mopo's account</Text>

                                <View style={{marginTop: 10}}></View>

                                <View style={styles.viewInputText}>
                                    <Image 
                                        style={{width: 24, height: 24, marginLeft: 10} }
                                        source={require('../assets/images/ic_mopo_user.png')} resizeMode="contain"
                                    />
                                    <TextInput 
                                        style={{width: "100%"}} 
                                        textContentType="emailAddress" 
                                        keyboardType='email-address' 
                                        onChangeText={text => this.setEmail(text)} 
                                        placeholder="Email"
                                        value={this.state.email}/>
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
                                        placeholder="Password"
                                        value={this.state.password}/>
                                </View>

                                <View style={{width: "100%",flexDirection: "row", marginTop: 10, alignSelf: "flex-start", alignItems: "center", marginTop: 15}}>
                                    {this.renderCheckBox()}
                                    <Text style={[styles.textContent, {marginLeft: 5}]}>Remember Me</Text>
                                </View>

                                <TouchableOpacity style={styles.backgroundButton} onPress={() => this.validation(this.state.email, this.state.password)}>
                                    <Text style={styles.textButton}>SIGN IN</Text>
                                </TouchableOpacity>

                                <View style={{width: "100%",flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center"}}>
                                    <TouchableOpacity 
                                    style={styles.backgroundButtonTrans}
                                    onPress={() => this.props.navigation.navigate('CreateAccount')}>
                                        <Text style={styles.textContent} >CREATE ACCOUNT</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    style={styles.backgroundButtonTrans}
                                    onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                        <Text style={styles.textContent} >FORGOT PASSWORD?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{flexDirection: "column", width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center', position: 'absolute'}}>
                            <TouchableOpacity 
                            style={{height: 40,marginBottom: 20}}
                            onPress={() => this.clickUsingQuikApp()}
                            >
                                <View style={{borderBottomWidth: 1,borderBottomColor: "#3C7B5E"}}>
                                    <Text style={{fontSize: 15, color: "#3C7B5E"}}>Quik start app</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={{fontSize: 12, color: "#3C7B5E", marginBottom: 3, marginRight: 3, alignSelf: "flex-end"}}>{ValueStrings.version_app}</Text>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    content_main: {
        width: "100%", height: "100%",
        backgroundColor: "#fff"
    },

    image_background: {
        width: "100%", height: "100%",
    },

    content: {
        width: "100%",
        height: "100%",
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: "20%",
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

    textHeader: {
        fontSize: 25,
        fontWeight: "bold",
        color: '#3C7B5E'
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

    backgroundButtonTrans: {
        height: 45,
        backgroundColor: '#00000000',
        borderRadius: 45/2,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    textButton: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#fff',
    },
    checkbox: {
        alignSelf: "center",
        color: '#fff',
    },
})

function mapStateToProps(state){
    return {
        // isQuikApp: state.Home.isQuikApp,
    };
}

const mapDispatchToProps = dispatch => ({
    addAccountInfo: (obj) => dispatch(addAccountInfo(obj)),
    set_quik_app: (val) => dispatch(set_quik_app(val)),
    set_page_screen: (val) => dispatch(set_page_screen(val)),
    setMultiBMS: (val) => dispatch(setMultiBMS(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);