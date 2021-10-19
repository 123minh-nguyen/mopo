import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, Platform} from 'react-native';

import DashBoard from './DashBoardScreen'
import ScanBle from './ScanBLEScreen'
import ScanBLEMulti from './ScanBLEMultiBMSScreen'
import Maps from './MapsScreen'
import ParameterView from './ParameterViewScreen'
import ParameterViewIcon from './ParameterViewIconScreen'
import Notification from './NotificationScreen'
import User from './UserScreen'

import {connect} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height'
import {clear_list_device, setIntervalReadData, connectDeviceByMac} from '../actions/actions'
import {set_page_screen, setStyleAlerAction, setCloseAlerAction, updateListNotify, setMultiBMS} from '../actions/action_home'
import ValueStrings from '../utils/Strings'
import {setAsyncStorage} from '../utils/AsyncStorageModel'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {checkNetwork} from '../utils/utilConfig'

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class HomeScreen extends Component{

    constructor (props) {
        super(props);
        this.state = {
            mac_last_connect: "",
        }
    }

    componentDidMount() {
        // this.props.setIntervalReadData();
        // this.upListNotify();
        // this.checkConnectMulti();
        // this.getLastConnectDevice();
    }

    getLastConnectDevice(){
        if(this.props.statusBle == 0){
            try {
                AsyncStorage.getItem(ValueStrings.key_last_connected_device).then((value) => {
                    let lastConnectDevice = value;
                    if(lastConnectDevice != "" && lastConnectDevice != undefined && lastConnectDevice != null){
                        this.setState({
                            mac_last_connect: lastConnectDevice,
                        })
                        this.props.setStyleAlerAction(ValueStrings.notify_question, lastConnectDevice);
                    }
                }).catch(e => {
                    return e;
                });
            } catch (error) {
            }
        }
    }

    upListNotify(){
        this.props.updateListNotify(this.props.accountInfo.UserID);
    }

    renderElement() {
        if(this.props.pageScreen === 0){
            return <DashBoard func={this.setPositionButtonNav.bind(this)}/>;
        } 
        else if (this.props.pageScreen === 1){
            if(this.props.isMultiBMS){
                return <ScanBLEMulti/>;
            } else {
                return <ScanBle/>;
            }
        }
        else if (this.props.pageScreen === 2){
            return <Notification/>;
        }
        else if (this.props.pageScreen === 5){
            if(checkNetwork()){
                return <Maps/>
            }
        }
        else if (this.props.pageScreen === 3){
            if(checkNetwork()){
                return <User func={this.setSignOutEvent.bind(this)}/>;
            }
        }
        else if(this.props.pageScreen === 4){
            return <ParameterViewIcon func={this.setPositionButtonNav.bind(this)}/>
        }
    }

    checkConnectMulti(){
        try {
            AsyncStorage.getItem(ValueStrings.key_is_connect_multi).then((value) => {
                let connectMulti = JSON.parse(value);
                if(connectMulti != null && connectMulti != undefined && connectMulti.isMulti){
                    this.props.setMultiBMS(true);
                } else {
                    this.props.setMultiBMS(false);
                }
            }).catch(e => {
                this.props.setMultiBMS(false);
            });
        } catch (error) {
            this.props.setMultiBMS(false);
        }
    }

    setHeightStatusBar(){
        if(this.props.platform === 'ios'){
            return getStatusBarHeight();
        } else {
            return getStatusBarHeight();
        }
    }

    setPositionButtonNav(posiiton){
        if(posiiton == 1){
            this.checkConnectMulti();
        }

        if(posiiton == 0){
            if(this.props.deviceConnected.id != undefined){
                this.props.set_page_screen(posiiton);
            } else {
                this.props.setStyleAlerAction(ValueStrings.toast_maketext, ValueStrings.connect_device_please);
            }
        } else if(posiiton == 5){
            if(Platform.OS === 'ios'){
                this.props.set_page_screen(posiiton);
            } else {
                Geolocation.getCurrentPosition(
                    (position) => {
                        this.props.set_page_screen(posiiton);
                    }, (error) =>  {
                        if(error.code == 2){
                            this.props.setStyleAlerAction(ValueStrings.toast_maketext, 'Please turn on your "GPS"');
                        } else if(error.code == 3){
                            this.props.set_page_screen(posiiton);
                        }
                    }
                );
            }
        } else {
            this.props.set_page_screen(posiiton);
        }

        
    }

    renderColorStatusBarIOS(){
        if(Platform.OS === 'ios'){
            return <View style={{width: "100%", height: getStatusBarHeight(), backgroundColor: "#00000090", position: "absolute"}}></View>
        }
    }

    getHeightAndroidX(){
        if(Platform.OS === 'ios'){
            return getStatusBarHeight();
        } else {
            if(getStatusBarHeight() > 25){
                return 0;
            } else {
                return getStatusBarHeight();
            }
        }
    }

    setSignOutEvent(){
        setAsyncStorage(ValueStrings.key_is_login, JSON.stringify({isLogin: false}))
        this.props.navigation.replace('Login');
    }

    showAlert(styleAler){
        if(styleAler.styleShowAler === ValueStrings.connect_device){
            return <View style={styles.content_alert_connecting}>
                <Text style={{color: "#fff", fontSize: 15, fontWeight: 'bold'}}>{ValueStrings.connecting}</Text>
            </View>
        } else if (styleAler.styleShowAler === ValueStrings.toast_maketext){
            setTimeout(function() { 
                if(styleAler.styleShowAler === ValueStrings.toast_maketext){
                    this.props.setCloseAlerAction();
                }
            }.bind(this), 
                2000);
            return <View style={styles.contentViewMakeText}>
                <View style={styles.contentMakeText}>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{styleAler.message}</Text>
                </View>
            </View>
        } else if(styleAler.styleShowAler === ValueStrings.warning){
            return <View style={styles.contentViewMakeText}>
                <View style={styles.contentMakeTextQuestion}>
                    <Image style={{width: 32, height: 32, marginBottom: 10}} source={require('../assets/images/ic_mopo_warning.png')} resizeMode="stretch"/>
                    <Text style={{fontSize: 15, fontWeight: "bold", marginTop: 5, marginBottom: 5}}>{styleAler.message}</Text>
                    <View style={{flexDirection: "row",width: "100%", height: 30, justifyContent: "space-between", marginTop: 10}}>
                        <TouchableOpacity 
                            style={{flex: 1, justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderColor: "#C5C5C5"}}
                            onPress={() => this.CloseAlert()}>
                            <Text style={{color: "#001EDD"}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        } else if(styleAler.styleShowAler === ValueStrings.process){
            return <View style={{flex: 1 ,width: width_window, height: height_window, backgroundColor: "#000000A0", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: "#fff", fontSize: 15, fontWeight: 'bold'}}>{styleAler.message}</Text>
            </View>
        } else if(styleAler.styleShowAler === ValueStrings.notify_question){
            return <View style={styles.contentViewMakeText}>
                <View style={styles.contentMakeTextQuestion}>
                    <Text style={{fontSize: 15, fontWeight: "bold", marginTop: 5, marginBottom: 5}}>Last connected device "{this.state.mac_last_connect}" Do you want to continue connecting</Text>
                    <View style={{flexDirection: "row",width: "100%", height: 30, justifyContent: "space-between", marginTop: 10}}>
                        <TouchableOpacity 
                            style={{flex: 1, justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderColor: "#C5C5C5"}}
                            onPress={() => this.CloseAlert()}>
                            <Text style={{color: "#001EDD"}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{flex: 1, justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderColor: "#C5C5C5"}}
                            onPress={() => this.connectLastDevice()}>
                            <Text style={{color: "#001EDD"}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }
    }

    CloseAlert(){
        this.props.setCloseAlerAction();
    }

    connectLastDevice(){
        this.props.connectDeviceByMac(this.state.mac_last_connect);
    }

    renderCountNotify(){
        if(this.props.listNotify.filter(el => !el.read).length > 0){
            return  <View style={{flexDirection: "row",position: "absolute", width: 30, height: 30, justifyContent: "space-between"}}>
                    <View/>
                    <View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: "#f55", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 10,color: "#fff"}}>{this.props.listNotify.filter(el => !el.read).length}</Text>
                    </View>
                </View>
        }
    }

    checkRenderQuikApp(val){
        if(!val){
            return (
                <>
                    <TouchableOpacity
                    style={[styles.navButton, {backgroundColor: (this.props.pageScreen === 2 ? "#00000060" : "#000000C0")}]}
                    onPress={() => this.setPositionButtonNav(2)}>
                        <Image style={styles.navImage} source={require('../assets/ic_mopo_notify.png')} resizeMode="stretch"/>
                        {this.renderCountNotify()}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, {backgroundColor: (this.props.pageScreen === 5 ? "#00000060" : "#000000C0")}]}
                        onPress={() => this.setPositionButtonNav(5)}>
                        <Image style={styles.navImage} source={require('../assets/ic_mopo_map.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, {backgroundColor: (this.props.pageScreen === 3 ? "#00000060" : "#000000C0")}]}
                        onPress={() => this.setPositionButtonNav(3)}>
                        <Image style={styles.navImage} source={require('../assets/ic_mopo_user.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
                </>
            )
        }
    }

    render(){
        return(
            <>
                <View style={{width: "100%", height: "100%", backgroundColor: "#fff", position: "absolute"}}>
                    <Image style={{width: "100%", height: "100%"}} source={require('../assets/images/background_mopo_2.png')} resizeMode="stretch"/>
                    {this.renderColorStatusBarIOS()}
                </View>
                
                <View style={{width: width_window, height: height_window - this.setHeightStatusBar(), marginTop: getStatusBarHeight(), justifyContent: "space-between"}}>
                    <View style={{width: "100%", height: height_window - 50 - this.getHeightAndroidX(), paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                        <View style={{flex: 1, backgroundColor: "#000000A0", width: "100%", height: "100%", borderRadius: 10, borderWidth: 1, borderColor: "#fff"}}>
                            { this.renderElement() }
                        </View>
                    </View>

                    <View style={{width: width_window, height: 50}}>
                        <View style={{flex:1, flexDirection: "row", paddingLeft: 5, paddingRight: 5}}>
                            <TouchableOpacity
                                style={[styles.navButton, {backgroundColor: ((this.props.pageScreen === 0 || this.props.pageScreen === 4) ? "#00000060" : "#000000C0")}]}
                                onPress={() => this.setPositionButtonNav(0)}>
                                <Image style={styles.navImage} source={require('../assets/ic_mopo_home.png')} resizeMode="stretch"/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.navButton, {backgroundColor: (this.props.pageScreen === 1 ? "#00000060" : "#000000C0")}]}
                                onPress={() => this.setPositionButtonNav(1)}>
                                <Image style={styles.navImage} source={require('../assets/ic_mopo_list.png')} resizeMode="stretch"/>
                            </TouchableOpacity>
                            {this.checkRenderQuikApp(this.props.isQuikApp)}
                        </View>
                    </View>
                </View>

                {this.showAlert(this.props.styleAler)}
            </>
        )
    }
}

const styles = StyleSheet.create({
    navButton: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    navImage: {
        width: 24,
        height: 24,
    },
    contentViewMakeText: {
        flex: 1, 
        width: "100%", height: "100%", 
        position: "absolute", 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 20
    },

    contentMakeTextQuestion: {
        width: "100%",
        borderRadius: 10, 
        borderColor: "#dddddd",
        borderWidth: 1,
        backgroundColor: "#fff", 
        justifyContent: "center", 
        alignItems: "center", 
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.8,
        shadowRadius: 9.51,
        elevation: 15,
    },

    contentMakeText: {
        width: "100%",
        borderRadius: 10, 
        borderColor: "#dddddd",
        borderWidth: 1,
        backgroundColor: "#fff", 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.8,
        shadowRadius: 9.51,
        elevation: 15,
    },

    cameraContainer: {
        width: width_window - 22,
        height: height_window - 20 - 170,
        borderRadius: 10
    },

    content_alert_connecting: {
        flex: 1 ,
        width: width_window, height: height_window, 
        backgroundColor: "#000000A0", 
        position: "absolute", 
        justifyContent: "center", 
        alignItems: "center",
        marginTop: getStatusBarHeight(),
    }
})

function mapStateToProps(state){
    return{
        statusBle: state.Ble.statusBle,
        deviceConnected: state.Ble.deviceConnected,
        styleAler: state.Home.styleAler,
        pageScreen: state.Home.pageScreen,
        listNotify: state.Home.listNotify,
        accountInfo: state.Home.accountInfo,
        isMultiBMS: state.Home.isMultiBMS,
        isQuikApp: state.Home.isQuikApp,
    };
}

const mapDispatchToProps = dispatch => ({
    clear_list_device: () => dispatch(clear_list_device()),
    setIntervalReadData: () => dispatch(setIntervalReadData()),
    setStyleAlerAction: (key, msg) => dispatch(setStyleAlerAction(key, msg)),
    setCloseAlerAction: () => dispatch(setCloseAlerAction()),
    set_page_screen: (val) => dispatch(set_page_screen(val)),
    updateListNotify: (val) => dispatch(updateListNotify(val)),
    setMultiBMS: (val) => dispatch(setMultiBMS(val)),
    connectDeviceByMac: (val) => dispatch(connectDeviceByMac(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
