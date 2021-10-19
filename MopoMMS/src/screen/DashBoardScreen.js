import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform} from 'react-native'
import {connect} from 'react-redux';
import {roundNumber} from '../utils/utilConfig'
import {setOnOfOutput} from '../actions/actions'
import {writeOnOffOutput_bms_xx} from '../actions/action_multi_bms_xx'

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class DashBoardScreen extends Component {

    constructor(props){
        super(props);
    }

    setColor(position){
        if(position === 1){
            if(this.props.dataConvert.soc > 0){
                if(this.props.dataConvert.soc < 16){
                    return "#FC4B4B"
                } else {
                    return "#46C88C"
                }
            } else {
                return "#00000000"
            }
        } else if(position === 2) {
            if(this.props.dataConvert.soc > 20){
                return "#46C88C"
            } else {
                return "#00000000"
            }
        } else if(position === 3) {
            if(this.props.dataConvert.soc > 40){
                return "#46C88C"
            } else {
                return "#00000000"
            }
        } else if(position === 4) {
            if(this.props.dataConvert.soc > 60){
                return "#46C88C"
            } else {
                return "#00000000"
            }
        } else if(position === 5){
            if(this.props.dataConvert.soc > 80){
                return "#46C88C"
            } else {
                return "#00000000"
            }
        }
    }

    eventOnOffDevice(){
        if(this.props.isMultiBMS){
            if(this.props.dataConvert.mosfet_state){
                this.props.writeOnOffOutput_bms_xx(false);
            } else {
                this.props.writeOnOffOutput_bms_xx(true);
            }
        } else {
            if(this.props.styleBMS !== 'AXE'){
                if(this.props.dataConvert.mosfet_state){
                    this.props.setOnOfOutput(false);
                } else {
                    this.props.setOnOfOutput(true);
                }
            }
        }
    }

    changeColoerButtonPower(){
        if(this.props.dataConvert.mosfet_state){
            return "#46C88C";
        } else {
            return "#AAAAAA";
        }
    }

    eventClickNextPage(){
        this.props.func(4);
    }

    render(){
        return(
            <>  
                <View style={styles.content}>
                    <Text style={{color: "#00000000", height: 1}}>{this.props.updateDataState}</Text>
                    <View style={styles.content_percent}>
                        <View style={styles.content_percent_battery}>
                            <View style={styles.content_percent_battery_top}/>
                            <View style={styles.content_percent_battery_body}>
                                <View style={{flex: 1, marginVertical: 3, backgroundColor: this.setColor(5), borderRadius: 5}}/>
                                <View style={{flex: 1, marginVertical: 3, backgroundColor: this.setColor(4), borderRadius: 5}}/>
                                <View style={{flex: 1, marginVertical: 3, backgroundColor: this.setColor(3), borderRadius: 5}}/>
                                <View style={{flex: 1, marginVertical: 3, backgroundColor: this.setColor(2), borderRadius: 5}}/>
                                <View style={{flex: 1, marginVertical: 3, backgroundColor: this.setColor(1), borderRadius: 5}}/>
                            </View>
                        </View>

                        <View style={styles.content_percent_action}>
                            <View style={styles.content_percent_action_content_text}>
                                <Text style={styles.content_percent_action_text}>{roundNumber(this.props.dataConvert.soc, 0)}</Text>
                                <Text style={[styles.content_percent_action_text_precent, {marginBottom: Platform.OS == 'ios' ? 0 : 10}]}>%</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.content_percent_action_button, {backgroundColor: this.changeColoerButtonPower()}]}
                                onPress={() => this.eventOnOffDevice()}
                                >
                                    <Image style={styles.content_percent_aciton_button_image} source={require('../assets/images/ic_mopo_signout.png')} resizeMode="contain"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.content_item_view}>
                        <View style={{flex: 1,flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                            <View style={styles.content_view_item_left}>
                                <Image style={styles.content_view_item_image} source={require('../assets/images/ic_mopo_vol.png')} resizeMode="contain"/>
                                <Text style={styles.content_view_item_text}>{this.props.dataConvert.total_voltage} V</Text>
                            </View>

                            <View style={styles.content_view_item_right}>
                                <Image style={styles.content_view_item_image} source={require('../assets/images/ic_mopo_voltmeter.png')} resizeMode="contain"/>
                                <Text style={styles.content_view_item_text}>{this.props.dataConvert.current} A</Text>
                            </View>
                        </View>
                        
                        <View style={{flex: 1,flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                            <View style={styles.content_view_item_left}>
                                <Image style={styles.content_view_item_image} source={require('../assets/images/ic_mopo_tem.png')} resizeMode="contain"/>
                                <Text style={styles.content_view_item_text}>{this.props.dataConvert.temp_max} °C</Text>
                            </View>

                            <View style={styles.content_view_item_right}>
                                <Image style={styles.content_view_item_image} source={require('../assets/images/ic_mopo_cycle_count.png')} resizeMode="contain"/>
                                <Text style={styles.content_view_item_text}>{this.props.dataConvert.cycle_count}</Text>
                            </View>
                        </View>
                    </View>

                    { !this.props.isMultiBMS && <View style={styles.content_view_action}>
                        <View/>
                        <TouchableOpacity
                            style={styles.content_action_button}
                            onPress={() => this.eventClickNextPage()}
                        >
                            <Image style={{width: "90%", height: "90%"}} source={require('../assets/images/ic_mopo_next.png')} resizeMode="stretch"/>
                        </TouchableOpacity>
                    </View> }
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1, 
        flexDirection: "column", 
        width: "100%", height: "100%", 
        alignItems: "center"
    },

    content_percent: {
        flexDirection: "row", 
        width: "90%", height: "45%", 
        justifyContent: "space-between"
    },

    content_percent_battery: {
        flexDirection: "column", 
        width: "40%", marginTop: "5%", 
        justifyContent: "center", 
        alignItems: 'center'
    },

    content_percent_battery_top: {
        width: "40%", height: "4%", 
        borderTopRightRadius: 5, 
        borderTopLeftRadius: 5, 
        backgroundColor: "#fff"
    },

    content_percent_battery_body: {
        flexDirection: "column", 
        width: "100%", height: "96%", 
        borderRadius: 10, 
        borderWidth: 3, 
        borderColor: "#fff", 
        justifyContent: "space-between", 
        padding: 5
    },

    content_percent_action: {
        flexDirection: "column", 
        width: "80%", alignItems: "center", 
        paddingRight: "10%", 
        justifyContent: "space-between"
    },

    content_percent_action_content_text: {
        flexDirection: "row", 
        height: "35%", 
        alignItems: "flex-end", 
        marginTop: "15%"
    },

    content_percent_action_text: {
        fontSize: 0.22 * width_window, 
        height: 0.3 * width_window, 
        textAlignVertical: "bottom", 
        color: "#fff"
    },

    content_percent_action_text_precent: {
        fontSize: 0.12 * width_window, 
        height: 0.2 * width_window, 
        textAlignVertical: "bottom", color: "#fff"
    },

    content_percent_action_button: {
        width: 0.15 * height_window, height: 0.15 * height_window, 
        borderRadius: 30, 
        borderColor: "#fff", 
        borderWidth: 3,  
        justifyContent: "center", 
        alignItems: "center"
    },

    content_percent_aciton_button_image: {
        width: "60%", height: "60%"
    },

    content_item_view: {
        flexDirection: "column", 
        width: "90%", height: "55%",
        paddingTop: 10, 
        paddingBottom: 10,
    },

    content_view_item_left: {
        flex: 1, flexDirection: "column", 
        height: "100%", 
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingBottom: 10,
        paddingTop: 10,
        marginRight: 10, 
        borderRadius: 10, 
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#fff",
        borderWidth: 3,
    },

    content_view_item_right: {
        flex: 1, flexDirection: "column", 
        height: "100%", 
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingBottom: 10,
        paddingTop: 10,
        marginLeft: 10, 
        borderRadius: 10, 
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#fff",
        borderWidth: 3,
    },

    content_view_item_image: {
        height: "40%",
    },

    content_view_item_text: {
        fontSize: 0.1 * width_window, fontWeight: "bold", color: "#fff"
    },

    content_view_action: {
        width: "100%", height: "7%", 
        flexDirection: "row", 
        position: "absolute",
        justifyContent: "space-between", 
        alignItems: "center",
        paddingLeft: 0.01 * height_window,
        paddingRight: 0.01 * height_window,
    },

    content_action_button: {
        width: 0.05 * height_window, height: 0.05 * height_window, 
        borderRadius: (0.05 * height_window)/2,
        borderWidth: 1,
        borderColor: "#fff",
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#ffffffa0"
    },
})

function mapStateToProps(state){
    return{
        dataConvert: state.Ble.dataConvert,
        updateDataState: state.Home.updateDataState,
        isMultiBMS: state.Home.isMultiBMS,
        styleBMS: state.Home.styleBMS,
    };
}
  
const mapDispatchToProps = dispatch => ({
    setOnOfOutput: val => dispatch(setOnOfOutput(val)),
    writeOnOffOutput_bms_xx: val => dispatch(writeOnOffOutput_bms_xx(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardScreen);