import React, {Component} from 'react'
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView, Alert} from 'react-native'
import {connect} from 'react-redux';
import {startScan, clearListItem, addListMac, stopScan, autoDisconnect, sendData} from '../actions/action_multi_bms_xx'
import {setStyleAlerAction, setListMacSave, updateListMac} from '../actions/action_home'
import ValueStrings from '../utils/Strings'
import Geolocation from '@react-native-community/geolocation';
import QRCodeScanner from 'react-native-qrcode-scanner';

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class ScanBLEMultiScreen extends Component {

    constructor(props){
        super(props);
        // let { func } = this.props;
        this.state = {
            // obj: func,
            showScan: false,
            showDetail: false,
            itemDetai: {},
        }
        this.getListMacSave();
    }

    getListMacSave(){
        if(this.props.listMacSave !== null && this.props.listMacSave.length < 1){
            this.props.setListMacSave(ValueStrings.list_mac_save);
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
            this.connectByMacArray(e.data.trim())
        }
    };

    connectByMacArray(val){
        this.closeScanQRCode();
        if(Platform.OS === 'ios'){
            this.connectDv(val);
        } else {
            Geolocation.getCurrentPosition((position) => {
                    this.connectDv(val);
            }, (error) =>  {
                if(error.code == 2){
                    this.showAlert('Please turn on your "GPS".\nAnd make sure your "Bluetooth" is turned on.');
                } else if(error.code == 3){
                    this.connectDv(val);
                }
            });
        }
    }

    connectDv(val){
        if(val !== null && val !== '' && val !== '...'){
            if(val.trim().substring(0, 12) === 'Mac.Address:'){
                let strArr = val.trim().substring(13).split(';')
                if(strArr.length > 1){
                    this.props.addListMac(strArr);
                    this.scanClick();
                } else {
                    this.showAlert('This is not MOPO_BMS_Multi.');
                }
                this.closeScanQRCode();
            } else {
                this.showAlert('The mac address is wrong.');
            }
        }
    }

    scanClick(){
        this.props.clearListItem();
        setTimeout(function() { this.props.stopScan();}.bind(this), 15000);
        this.props.startScan();
    }

    setDisconnectDevice(){
        this.props.disconnect();
    }

    showScanQRCode(){
        this.setState({ showScan: true})
    }

    closeScanQRCode(){
        this.setState({ showScan: false})
    }

    renderButtonActionRight(){
        if(this.props.listPackStyle.length < 1){
            return <View style={styles.content_view_action_button}>
                <TouchableOpacity
                    style={styles.content_action_button}
                    onPress={() => this.showScanQRCode()}
                >
                    <Image style={{width: "100%", height: "100%"}} source={require('../assets/images/ic_mopo_qr_code.png')} resizeMode="stretch"/>
                </TouchableOpacity>
            </View>
        } else {
            return <View style={styles.content_view_action_button}>
                <TouchableOpacity
                    style={[styles.content_action_button, {backgroundColor: "#46C88C"}]}
                    onPress={() => this.setDisconnectDevice()}
                >
                    <Image style={styles.content_image_button} source={require('../assets/images/ic_mopo_disconnect.png')} resizeMode="stretch"/>
                </TouchableOpacity>
            </View>
        }
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

    convert(){
        if(this.props.listMacSave !== null && this.props.listMacSave !== ''){
            return JSON.parse(this.props.listMacSave);
        } else {
            return [];
        }
    }

    editItem(id){
        let itemById = JSON.parse(this.props.listMacSave).filter(function (el) { return el.id === id; });
        // this.state.obj(itemById[0])
        this.props.setStyleAlerAction(ValueStrings.save_mac_battery, JSON.stringify(itemById))
    }

    getValueMax(item){
        var max = 0;
        item.forEach(el => {
            if(max < el){
                max = el;
            }
        })
        return max;
    }

    getValueProtectDetai(item){
        var error = '';
        item.forEach(el => {
            if(el.isProtect){
                error += el.protectionTypes + "\n";
            }
        })
        return error;
    }

    showViewDetail(item){
        this.setState({
            showDetail: true,
            itemDetai: item,
        })
    }

    closeViewDetail(){
        this.setState({
            showDetail: false,
            itemDetai: {},
        })
    }

    renderItemDetail(){
        if(this.state.showDetail){
            return <View style={styles.contentViewDetail}>
                    <ScrollView style={{width: "100%", height: "100%"}}>
                        <View style={{width: "100%", position: "absolute", justifyContent: "center", alignItems: "center", marginTop: 20}}>
                            <Text style={{fontSize: 20, fontWeight: "bold"}}>{this.state.itemDetai.mac}</Text>
                        </View>
                        
                        <View style={{width: "100%", marginTop: 60}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Name: </Text>
                            <Text>{this.state.itemDetai.name}</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Char Swith: </Text>
                            <Text>{this.state.itemDetai.charSwithOnOff ? "ON" : "OFF"}</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Dis Swith: </Text>
                            <Text>{this.state.itemDetai.disSwithOnOff  ? "ON" : "OFF"}</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>SOC: </Text>
                            <Text>{this.state.itemDetai.rsoc} %</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Voltage: </Text>
                            <Text>{this.state.itemDetai.totalVoltage} V</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Current: </Text>
                            <Text>{this.state.itemDetai.current} A</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Temp: </Text>
                            <Text>{this.getValueMax(this.state.itemDetai.tempList)} °C</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Remaind Power: </Text>
                            <Text>{this.state.itemDetai.remaindPower} Ah</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Nominal Power: </Text>
                            <Text>{this.state.itemDetai.nominalPower} Ah</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Cycle Times: </Text>
                            <Text>{this.state.itemDetai.cycleTimes} times</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-between'}}>
                            <Text>Protection State: </Text>
                            <Text>{this.getValueProtectDetai(this.state.itemDetai.protectionStateList)}</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "#DDDDDD", marginTop: 10, marginBottom: 20}}/>
                    </ScrollView>

                    <TouchableOpacity 
                        style={styles.contentViewBackButton}
                        onPress={() => this.closeViewDetail()}>
                        <Image style={{width: "60%", height: "60%"}} source={require('../assets/images/ic_mopo_back.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
            </View>
        }
    }

    render(){
        return(
            <>
                <View style={{flexDirection: 'column' ,width: "100%", height: "100%"}}>
                    <View style={styles.content_view_action}>
                        <View/>
                        {this.renderButtonActionRight()}
                    </View>

                    <View style={{padding: 10}}>
                        {
                            this.props.listPackStyle.length > 0 
                            &&   <FlatList 
                                    data = {this.props.listPackStyle}
                                    renderItem={({item}) => (
                                        <TouchableOpacity style={styles.button} onPress={() => this.showViewDetail(item)}>
                                            <View style={styles.contentItem}>
                                                <Text style={styles.textItem}>{item.name}</Text>
                                                <Text style={styles.textItem_1} numberOfLines={1}>{item.mac}</Text>
                                            </View>

                                            <View style={styles.contentItemRight}>
                                                <View style={{width: 1}}/>
                                                <View style={styles.contentTextItemRight}>
                                                    <Text style={styles.textItemRight}>{item.disSwithOnOff ? "ON" : "OFF"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            // :   <FlatList 
                            //         data = {this.convert()}
                            //         renderItem={({item}) => (
                            //             <View style={styles.button}>
                            //                 <View style={styles.contentItem}>
                            //                     <Text style={styles.textItem}>{item.title}</Text>
                            //                     <Text style={styles.textItem_1} numberOfLines={1}>{item.mac}</Text>
                            //                 </View>

                            //                 <View style={styles.contentItemRight}>
                            //                     <View style={{width: 1}}/>
                            //                     <View style={styles.contentTextItemRight}>
                            //                         <View style={{height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            //                             <TouchableOpacity
                            //                                 style={{marginLeft: 10, marginRight: 15}}
                            //                                 onPress={() => this.editItem(item.id)}
                            //                             >
                            //                                 <Image style={{width: 24, height: 24}} source={require('../assets/images/ic_mopo_edit.png')} resizeMode="stretch"/>
                            //                             </TouchableOpacity>

                            //                             {item.title !== '...' && item.mac !== '...' 
                            //                                 ?   <TouchableOpacity
                            //                                         style={{marginLeft: 15, marginRight: 10}}
                            //                                         onPress={() => this.connectByMacArray(item.mac)}
                            //                                     >
                            //                                         <Image style={{width: 24, height: 24}} source={require('../assets/images/ic_mopo_disconnect.png')} resizeMode="stretch"/>
                            //                                     </TouchableOpacity>
                            //                                 :   null
                            //                             }
                                                        
                            //                         </View>
                            //                     </View>
                            //                 </View>
                            //             </View>
                            //         )}
                            //         keyExtractor={(item, index) => index.toString()}
                            //     />
                        }
                    </View>
                </View>  

                {this.rederScanQRCodeView()}   
                {this.renderItemDetail()}         
            </>
        )
    }
}

const styles = StyleSheet.create({
    textItem: {
        width: "60%", 
        textAlignVertical: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },
    textItem_1: {
        width: "60%", 
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
        width: 0.05 * height_window, height: 0.05 * height_window, 
        borderRadius: (0.05 * height_window)/2,
        borderWidth: 1,
        borderColor: "#fff",
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#000000a0",
        marginTop: 5,
        marginLeft: 5,
        position: "absolute"
    },

    content_action_button: {
        width: 0.05 * height_window, height: 0.05 * height_window, 
        borderRadius: (0.05 * height_window)/2,
        borderColor: "#fff",
        justifyContent: "center", 
        alignItems: "center",
    },

    content_image_button: {
        width: "60%", height: "60%"
    },
})

function mapStateToProps(state){
    return{
        itemList: state.MultiBMS.itemList,
        listMac: state.MultiBMS.listMac,
        listPackStyle: state.Home.listPackStyle,
        listMacSave: state.Home.listMacSave,
    };
}
  
const mapDispatchToProps = dispatch => ({
    addListMac: mac => dispatch(addListMac(mac)),
    startScan: () => dispatch(startScan()),
    stopScan: () => dispatch(stopScan()),
    clearListItem: () => dispatch(clearListItem()),
    sendData: (macAddress, byteArray) => dispatch(sendData(macAddress, byteArray)),
    disconnect: () => dispatch(autoDisconnect()),
    setStyleAlerAction: (styleAler, message) => dispatch(setStyleAlerAction(styleAler, message)),
    setListMacSave: (key) => dispatch(setListMacSave(key)),
})

export default connect(mapStateToProps,mapDispatchToProps)(ScanBLEMultiScreen);