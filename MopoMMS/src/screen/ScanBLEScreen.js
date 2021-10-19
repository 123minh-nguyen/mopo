import React, {Component} from 'react'
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView, Alert} from 'react-native'
import {connect} from 'react-redux';
import {scanDevice, stopScan, clear_list_device, status_ble, connectDevice, testConvertData, disconnectDevice, connectDeviceByMac} from '../actions/actions'
import {convertMacBleIOS} from '../utils/utilConfig';
import Geolocation from '@react-native-community/geolocation';
import QRCodeScanner from 'react-native-qrcode-scanner';

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class ScanBLEScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            count_time_scan: 0,
            str_scan: 'Scaning .',
            intervalScan: null,
            timeOutScan: null,
            showScan: false,
        }
    }

    showAlert (msg) {
        Alert.alert(
            "",
            msg,
            [
                { text: "OK", onPress: () => console.log("Ok Pressed")}
            ],
            { cancelable: false }
        );
    }

    onSuccess = e => {
        if(e !== null && e.data !== ''){
            this.closeScanQRCode();
            if(Platform.OS){
                this.connectDvByQRCode(e.data);
            } else {
                Geolocation.getCurrentPosition(
                    (position) => {
                        this.connectDvByQRCode(e.data);
                    }, (error) =>  {
                        if(error.code == 2){
                            this.showAlert('Please turn on your "GPS". And make sure your "Bluetooth" is turned on.');
                        } else if(error.code == 3){
                            this.connectDvByQRCode(e.data);
                        }
                    }
                );
            }
        }
    };

    set_clear_time() {
        clearInterval(this.state.intervalScan);
        clearTimeout(this.state.timeOutScan);
        this.setState({
            str_scan: 'Scaning .',
            intervalScan: null,
            timeOutScan: null,
        })
    }

    connectDevice(device){
        if(device != null){
            this.set_clear_time();
            this.props.connectDevice(device);
        }
    }

    connectDvByQRCode(val){
        if(val !== null && val !== '' && val !== '...'){
            if(val.trim().substring(0, 12) === 'Mac.Address:'){
                let strArr = val.trim().substring(13)
                if(strArr.length > 0){
                    this.props.connectDeviceByMac(strArr);
                }
            } else {
                // console.log("Log get data is not success");
                this.showAlert('Please turn on your "GPS". And make sure your "Bluetooth" is turned on.');
            }
        }
    }

    scanDevice(){
        if(this.state.intervalScan != null && this.state.timeOutScan != null){
            this.set_clear_time();
            setTimeout(() => {
                this.scan();
            }, 500);
        } else {
            this.scan();
        }
    }

    checkGPSForAndroid(){
        if(Platform.OS === 'ios'){
            this.scanDevice();
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.scanDevice();
                }, (error) =>  {
                    if(error.code == 2){
                        this.showAlert('Please turn on your "GPS". And make sure your "Bluetooth" is turned on.');
                    } else if(error.code == 3){
                        this.scanDevice();
                    }
                }
            );
        }
    }

    scan(){
        this.props.status_ble(1);
        this.props.clear_list_device();
        this.setState({
            intervalScan: setInterval(() => { 
                this.setStateScaning();
            }, 1000),

            timeOutScan: setTimeout(() => {
                if(this.props.statusBle == 1){
                    this.props.status_ble(0);
                    this.set_clear_time();
                    this.props.stopScan();
                }
            }, 20000),
        });
        this.props.scanDevice();
    }

    setDisconnectDevice(){
        this.props.disconnectDevice();
    }

    setStateScaning(){
        if(this.state.count_time_scan > 2){
            this.setState({
                count_time_scan: 0,
                str_scan: 'Scaning .',
            })
        } else {
            this.setState({
                count_time_scan: this.state.count_time_scan + 1,
                str_scan: this.state.str_scan + '.',
            })
        }
    }

    renderStatusScan(){
        if(this.props.statusBle == 1){
            return <Text style={{color: "#fff", fontSize: (0.05 * width_window)}}>{this.state.str_scan}</Text>
        }
    }

    renderButtonActionRight(){
        return 
    }

    showScanQRCode(){
        this.setState({ showScan: true})
    }

    closeScanQRCode(){
        this.setState({ showScan: false})
    }

    rederScanQRCodeView(){
        if(this.state.showScan){
            return <View style={{width: "100%", height: "100%", position: "absolute", backgroundColor: "#000", borderRadius: 10}}>
                <QRCodeScanner
                    onRead={this.onSuccess}
                    bottomContent={
                        <Text style={{color: "#fff", fontSize: 18, fontWeight: "bold"}}>Move QR code inside</Text>
                    }
                    fadeIn={false}
                    showMarker={true}
                    topContent={
                        <View style={{flexDirection: "row",width: "100%"}}>
                            <TouchableOpacity
                                style={{marginLeft: 10, marginRight: 10}}
                                onPress={() => this.closeScanQRCode()}
                            >
                                <Image style={{width: 25, height: 25}} source={require('../assets/images/ic_mopo_back.png')} resizeMode="stretch"/>
                            </TouchableOpacity>
                            <Text style={{color: "#fff", fontSize: 23, fontWeight: "bold"}}>Scan QR code</Text>
                        </View>
                    }
                    cameraStyle={styles.cameraContainer}
                    topViewStyle={styles.zeroContainer}
                    bottomViewStyle={styles.zeroContainer}
                />
            </View>
        }
    }

    render(){
        return(
            <>
                <View style={styles.content_view_main}>
                    <View style={styles.content_view_action}>
                        <View>
                            {this.renderStatusScan()}
                        </View>
                        
                        
                        <View style={styles.content_view_action_button}>
                            {
                                this.props.deviceConnected.mac != undefined &&
                                <TouchableOpacity
                                style={[styles.content_action_button, {backgroundColor: "#FC4B4B", marginRight: 0.02 * height_window}]}
                                onPress={() => this.setDisconnectDevice()}
                                >
                                    <Image style={styles.content_image_button} source={require('../assets/images/ic_mopo_disconnect.png')} resizeMode="stretch"/>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity
                                style={[styles.content_action_button, {backgroundColor: "#46C88C", marginRight: 0.02 * height_window}]}
                                onPress={() => this.checkGPSForAndroid()}
                            >
                                <Image style={styles.content_image_button} source={require('../assets/images/ic_mopo_scan.png')} resizeMode="stretch"/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.content_action_button}
                                onPress={() => this.showScanQRCode()}
                            >
                                <Image style={{width: "100%", height: "100%"}} source={require('../assets/images/ic_mopo_qr_code.png')} resizeMode="stretch"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.content_view_body}>
                        <FlatList 
                            data = {this.props.itemList}
                            renderItem={({item}) => (
                                <TouchableOpacity style={styles.button}
                                onPress={() => this.connectDevice(item)}>
                                    <View style={styles.contentItem}>
                                        <Text style={styles.textItem}>{item.name}</Text>
                                        <Text style={styles.textItem_1} numberOfLines={1}>{Platform.OS === 'ios' ? convertMacBleIOS(item.manufacturerData) : item.id}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>

                {this.rederScanQRCodeView()}    
            </>
        )
    }
}

const styles = StyleSheet.create({

    content_view_main: {
        height: "100%", 
        flexDirection: "column", 
        alignItems: "center"
    },

    content_view_action: {
        width: "100%", height: "7%", 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        paddingLeft: 0.01 * height_window,
        paddingRight: 0.01 * height_window,
    },

    content_view_action_button: {
        height: "100%", 
        flexDirection: "row", 
        alignItems: "center",
        
    },

    content_image_button: {
        width: "60%", height: "60%"
    },

    content_view_body: {
        width: "100%", height: "93%",
        paddingLeft: 0.01 * height_window,
        paddingRight: 0.01 * height_window,
    },

    textItem: {
        width: "100%", 
        textAlignVertical: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },
    textItem_1: {
        width: "100%", 
        textAlignVertical: "center",
        fontSize: 15,
        color: "#ffffffA0",
    },

    contentItem: {
        width: "100%", height: "100%",
        flexDirection: "column", 
        padding: 5, 
        borderBottomWidth: 1, 
        borderColor: "#ffffff50",
    },

    contentItemRight: {
        width: "100%", height: "100%", 
        justifyContent: "space-between", 
        alignItems: "center", 
        position: "absolute"
    },

    contentTextItemRight: {
        height: "100%", justifyContent: "center", 
        alignSelf: "flex-end"
    },

    textItemRight: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15
    },

    button: {
        width: "100%", height: 55,
    },

    zeroContainer: {
        height: 50,
        flex: 0,
    },
    
    cameraContainer: {
        width: width_window - 22,
        height: height_window - 20 - 170,
        borderRadius: 10
    },

    contentViewDetail: {
        flexDirection: "column", width: "100%", height: "100%", position: "absolute", backgroundColor: "#ffffff", borderRadius: 10, borderColor: "#000", borderWidth: 1, padding: 10
    },

    contentViewBackButton: {
        width: 40, height: 40, 
        backgroundColor: "#000000A0", 
        borderColor: "#ffffffA0", 
        borderRadius: 20, 
        borderWidth: 1, 
        padding: 7,
        marginLeft: 10,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 10,
        position: "absolute"
    },

    content_action_button: {
        width: 0.05 * height_window, height: 0.05 * height_window, 
        borderRadius: (0.05 * height_window)/2,
        borderColor: "#fff",
        justifyContent: "center", 
        alignItems: "center",
    },
})

function mapStateToProps(state){
    return{
        itemList: state.Ble.itemList,
        deviceConnected: state.Ble.deviceConnected,
        statusBle: state.Ble.statusBle,
    };
}
  
const mapDispatchToProps = dispatch => ({
    scanDevice: () => dispatch(scanDevice()),
    status_ble: (val) => dispatch(status_ble(val)),
    stopScan: () => dispatch(stopScan()),
    clear_list_device: () => dispatch(clear_list_device()),
    connectDevice: (device) => dispatch(connectDevice(device)),
    testConvertData: () => dispatch(testConvertData()),
    disconnectDevice: () => dispatch(disconnectDevice()),
    connectDeviceByMac: (val) => dispatch(connectDeviceByMac(val)),
})

export default connect(mapStateToProps,mapDispatchToProps)(ScanBLEScreen);