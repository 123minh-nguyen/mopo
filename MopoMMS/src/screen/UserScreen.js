import React, { Component } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, TextInput, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import {disconnectDevice} from '../actions/actions'
import {setCloseAlerAction, setStyleAlerAction} from '../actions/action_home'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValueStrings from '../utils/Strings'
import CheckBox from '@react-native-community/checkbox';
import {setAsyncStorage} from '../utils/AsyncStorageModel';
import md5 from 'md5'
import {checkNetwork} from '../utils/utilConfig'

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class UserScreen extends Component {

    constructor(props){
        super(props);
        let { func } = this.props;
        this.state = {
            obj: func,
            isSelectedMultiConnect: false,
            isChangePassword: false,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
        this.checkConnectMulti();
    }

    showAlert = (msg) => {
        Alert.alert(
            "",
            msg,
            [
                { text: "OK", onPress: () => console.log("Cancel Pressed")}
            ],
            { cancelable: false }
        );
    }

    clickSignOut(){
        this.props.disconnectDevice();
        this.props.setCloseAlerAction();
        this.props.func();
    }

    setIsChangePassword(val){
        this.setState({
            isChangePassword: val,
        })
    }

    setOldPassword(val){
        this.setState({
            oldPassword: val,
        })
    }

    setNewPassword(val){
        this.setState({
            newPassword: val,
        })
    }

    setConfirmPassword(val){
        this.setState({
            confirmPassword: val,
        })
    }

    clickChangePassword(val){
        this.setIsChangePassword(val);
        if(!val){
            this.setOldPassword("");
            this.setNewPassword("");
            this.setConfirmPassword("");
        }
    }

    validation(){
        if(checkNetwork()){
            Keyboard.dismiss;
            if(this.state.oldPassword === null || this.state.oldPassword === ""){
                this.showAlert("Please input old password.")
                return;
            } else if(this.state.newPassword === null || this.state.newPassword === ""){
                this.showAlert("Please input new password.")
                return;
            } else if(this.state.confirmPassword === null || this.state.confirmPassword === ""){
                this.showAlert("Please input confirm password.")
                return;
            } else if(this.state.newPassword !== this.state.confirmPassword){
                this.showAlert("Confirm password not match.")
                return;
            } else {
                this.changePassword();
            }
        }
    }

    async changePassword() {
        try {
            let response = await fetch(
                ValueStrings.BASE_URL + ValueStrings.API_CHANGE_PASSWORD,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.props.accountInfo.Email,
                        old_pass: md5(this.state.oldPassword),
                        new_pass: md5(this.state.newPassword),
                    })
                }
            );
            let json = await response.json();
            console.log("Quang: " + JSON.stringify(json.d));
            if(json.d == 1){
                this.clickChangePassword(false);
                this.showAlert("Change password success.");
            } else if (json.d == 2) {
                this.showAlert("This account does not exists.");
            } else if (json.d == 4) {
                this.showAlert("Current password incorrect.");
            } else {
                this.showAlert("Change failed.");
            }
          } catch (error) {
            console.error(error);
          }
    };

    setSelection(){
        if(this.props.statusBle > 2){
            this.showAlert("Please disconnect device.")
        } else {
            if(this.state.isSelectedMultiConnect){
                this.setState({
                    isSelectedMultiConnect: false,
                })
                setAsyncStorage(ValueStrings.key_is_connect_multi, JSON.stringify({isMulti: false}));
            } else {
                this.setState({
                    isSelectedMultiConnect: true,
                })
                setAsyncStorage(ValueStrings.key_is_connect_multi, JSON.stringify({isMulti: true}));
            }
        }
    }

    checkConnectMulti = () => {
        try {
            AsyncStorage.getItem(ValueStrings.key_is_connect_multi).then((value) => {
                let connectMulti = JSON.parse(value);
                if(connectMulti != null && connectMulti != undefined && connectMulti.isMulti){
                    this.setState({
                        isSelectedMultiConnect: true,
                    })
                } else {
                    this.setState({
                        isSelectedMultiConnect: false,
                    })
                }
            }).catch(e => {
                this.setState({
                    isSelectedMultiConnect: false,
                })
            });
        } catch (error) {
            this.setState({
                isSelectedMultiConnect: false,
            })
        }
    }

    renderCheckBox(){
        if(Platform.OS === 'ios'){
            return <CheckBox
                value={this.state.isSelectedMultiConnect}
                onValueChange={() => this.setSelection()}
                onCheckColor={'#3C7B5E'}
                onTintColor={'#3C7B5E'}
                style={{width: 24, height: 24}}
            />
        } else {
            return <CheckBox
                value={this.state.isSelectedMultiConnect}
                onValueChange={() => this.setSelection()}
                style={styles.checkbox}
                tintColors={{ true: '#3C7B5E', false: '#3C7B5E' }}
                style={{width: 24, height: 24}}
            />
        }
    }

    renderViewChangePassword(val){
        if(val){
            return(
                <View style={{width: "100%", height: "100%", position: "absolute", backgroundColor: "#000000A0", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <View style={{flexDirection: "column" ,width: "80%", borderRadius: 10, backgroundColor: "#fff", alignItems: "center", padding: 10}}>
                        <Text style={{fontSize: 20, fontWeight: "bold"}}>Change password</Text>
                        <View style={styles.viewInputText}>
                            <TextInput 
                                secureTextEntry={true} 
                                style={{width: "100%",}} 
                                onChangeText={text => this.setOldPassword(text)} 
                                placeholder="Old password"/>
                        </View>
                        <View style={styles.viewInputText}>
                            <TextInput 
                                secureTextEntry={true} 
                                style={{width: "100%",}} 
                                onChangeText={text => this.setNewPassword(text)} 
                                placeholder="New password"/>
                        </View>
                        <View style={styles.viewInputText}>
                            <TextInput 
                                secureTextEntry={true} 
                                style={{width: "100%",}} 
                                onChangeText={text => this.setConfirmPassword(text)} 
                                placeholder="Confirm password"/>
                        </View>
                        <View style={{flexDirection: "row", marginTop: 10}}>
                            <TouchableOpacity
                            style={{flex: 1, flexDirection: "row",width: 110, height: 40, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: '#3C7B5E', justifyContent: "center", alignItems: "center", marginRight: 1}}
                            onPress={() => this.clickChangePassword(false)}>
                                <Text style={{fontWeight: "bold", color: "#fff"}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={{flex: 1, flexDirection: "row",width: 110, height: 40, borderTopRightRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#3C7B5E', justifyContent: "center", alignItems: "center", marginLeft: 1}}
                            onPress={() => this.validation()}>
                                <Text style={{fontWeight: "bold", color: "#fff"}}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <View style={styles.contentMain}>
                    <View style={styles.contentViewImage}>
                        <View style={{width: 200, height: 200, borderWidth: 5, borderColor: "#fff", borderRadius: 100, backgroundColor: "#ffffff90", justifyContent: "center", alignItems: "center"}}>
                            <Image style={{width: 150, height: 150}} source={require('../assets/images/ic_mopo_account.png')} resizeMode="stretch"/>
                        </View>
                    </View>

                    <View style={styles.contentViewInfor}>
                        <View style={{flexDirection: "column", width: "100%", marginTop: 15, alignItems: "center"}}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{fontSize: 25, fontWeight: "bold"}}>{this.props.accountInfo.FullName}</Text>
                            </View>
                        </View>

                        <View style={styles.viewItem}>
                            <View style={{flexDirection: "row"}}>
                                <Image style={styles.navImage} source={require('../assets/images/genders.png')} resizeMode="stretch"/>
                                <Text style={styles.textInfor}>{this.props.accountInfo.Gender == 0 ? "Male" : "Female"}</Text>
                            </View>
                            <View style={styles.viewLine}/>
                        </View>

                        <View style={styles.viewItem}>
                            <View style={{flexDirection: "row"}}>
                                <Image style={styles.navImage} source={require('../assets/images/ic_mopo_birthday.png')} resizeMode="stretch"/>
                                <Text style={styles.textInfor}>{this.props.accountInfo.BirthDay}</Text>
                            </View>
                            <View style={styles.viewLine}/>
                        </View>

                        <View style={styles.viewItem}>
                            <View style={{flexDirection: "row"}}>
                                <Image style={styles.navImage} source={require('../assets/images/ic_mopo_email.png')} resizeMode="stretch"/>
                                <Text style={styles.textInfor}>{this.props.accountInfo.Email}</Text>
                            </View>
                            <View style={styles.viewLine}/>
                        </View>

                        <View style={styles.viewItem}>
                            <View style={{flexDirection: "row"}}>
                                <Image style={styles.navImage} source={require('../assets/images/ic_mopo_phone.png')} resizeMode="stretch"/>
                                <Text style={styles.textInfor}>{this.props.accountInfo.Phone}</Text>
                            </View>
                            <View style={styles.viewLine}/>
                        </View>

                        <View style={styles.viewItem}>
                            <View style={{flexDirection: "row"}}>
                                <Image style={styles.navImage} source={require('../assets/images/ic_mopo_address.png')} resizeMode="stretch"/>
                                <Text style={styles.textInfor}>{this.props.accountInfo.Address}</Text>
                            </View>
                            <View style={styles.viewLine}/>
                        </View>

                        <View style={{flexDirection: "row", width: "100%", marginTop: 15, justifyContent: "space-between"}}>
                            <View style={{width: "50%", height: '100%',flexDirection: "row", alignSelf: "flex-start", alignItems: 'center'}}>
                                {this.renderCheckBox()}
                                <Text style={[styles.textContent, {marginLeft: 5}]}>BMS Multi</Text>
                            </View>

                            <TouchableOpacity
                            style={{flexDirection: "row", height: 40, justifyContent: "center", alignItems: "center"}}
                            onPress={() => this.clickChangePassword(true)}>
                                <View style={{borderBottomWidth: 1,borderBottomColor: "#0274ff"}}>
                                    <Text style={{fontSize: 15, color: "#0274ff"}}>Change password</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: "row", width: "100%", marginTop: 15, justifyContent: "flex-end"}}>
                            <TouchableOpacity
                            style={{flexDirection: "row",width: 110, height: 40, borderRadius: 10, backgroundColor: '#3C7B5E', justifyContent: "center", alignItems: "center"}}
                            onPress={() => this.clickSignOut()}>
                                <Text style={{fontWeight: "bold", color: "#fff"}}>Sign Out</Text>
                                <Image style={{width: 20, height: 20, marginLeft: 5, marginRight: 5}} source={require('../assets/images/ic_mopo_sing_out_64.png')} resizeMode="stretch"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {this.renderViewChangePassword(this.state.isChangePassword)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentMain: {
        flex: 1, width: "100%", height: "100%", flexDirection: "column", padding: 10, justifyContent: "space-between",
    },

    contentViewImage: {
       flex: 3.5 ,width: "100%", height: "100%", justifyContent: "center", alignItems: "center"
    },

    contentViewInfor: {
        flex: 6.5 ,width: "100%", height: "100%", marginTop: 20, backgroundColor: "#fff", borderRadius: 10, padding: 10
    },

    contentChildViewInfor: {

    },

    textLabelInfor: {
        fontSize: 18,
        fontWeight: "bold"
    },

    textInfor: {
        fontSize: 18,
        paddingRight: 20,
    },

    navImage: {
        width: 24,
        height: 24,
        marginRight: 10
    },

    viewItem: {
        flexDirection: "column", width: "100%", marginTop: 15
    },

    viewLine: {
        backgroundColor: "#DDDDDD", width: "100%", height: 1, marginTop: 5
    },

    viewInputText: {
        width: "100%", height: 40,
        paddingLeft: 5,
        flexDirection: "row", 
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 8,
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
})

function mapStateToProps(state){
    return{
        accountInfo: state.Home.accountInfo,
        statusBle: state.Ble.statusBle,
    };
}

const mapDispatchToProps = dispatch => ({
    disconnectDevice: () => dispatch(disconnectDevice()),
    setCloseAlerAction: () => dispatch(setCloseAlerAction()),
    setStyleAlerAction: (key, msg) => dispatch(setStyleAlerAction(key, msg)),
})

export default connect(mapStateToProps,mapDispatchToProps)(UserScreen);