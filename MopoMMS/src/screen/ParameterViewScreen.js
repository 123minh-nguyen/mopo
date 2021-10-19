import React, {Component} from 'react'
import {View, Text, Dimensions, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux';
import {sendReset} from '../actions/actions'

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class ParameterViewScreen extends Component {
    constructor(props){
        super(props);
    }

    eventClickBackPage(){
        this.props.func(0);
    }

    renderVolCell(){
        for(i = 1; i < (this.props.dataConvert.num_of_cell + 1); i++){
            return 
        }
    }

    getDiagnostic(){
        var str = "\n";
        this.props.dataConvert.diagnostic.forEach(el => {
            str += el.diagnosticTypes + "\n";
        });
        return str;
    }

    render(){
        return(
            <View style={styles.content_view}>

                <View style={styles.content_view_body}>
                    <Text style={styles.content_view_body_text_name}>{this.props.deviceConnected.mac}</Text>

                    <Text style={{height: 1,color: "#00000000", marginTop: "7%"}}>{this.props.updateDataState}</Text>

                    <ScrollView style={styles.content_view_body_scroll}>
                        <View style={styles.content_view_item}>
                            <Text>Total voltage: </Text>
                            <Text>{this.props.dataConvert.total_voltage} V</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>Current: </Text>
                            <Text>{this.props.dataConvert.current} A</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>SOC: </Text>
                            <Text>{this.props.dataConvert.soc} %</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>SOH: </Text>
                            <Text>{this.props.dataConvert.soh}</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>Cycle count: </Text>
                            <Text>{this.props.dataConvert.cycle_count}</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>Mosfet state: </Text>
                            <Text>{this.props.dataConvert.mosfet_state ? "ON" : "OFF"}</Text>
                        </View>

                        { this.props.dataConvert.fcc > -1 && <View style={styles.content_view_item}>
                            <Text>Full charge capacity: </Text>
                            <Text>{this.props.dataConvert.fcc/100 + " Ah"}</Text>
                        </View>}

                        { this.props.dataConvert.rc > -1 && <View style={styles.content_view_item}>
                            <Text>Remaining capacity: </Text>
                            <Text>{this.props.dataConvert.rc/100  + " Ah"}</Text>
                        </View>}

                        { this.props.dataConvert.temp_sensor_1 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 1: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_1 + " °C"}</Text>
                        </View>}

                        {  this.props.dataConvert.temp_sensor_2 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 2: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_2 + " °C"}</Text>
                        </View>}

                        { this.props.dataConvert.temp_sensor_3 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 3: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_3 + " °C"}</Text>
                        </View>}

                        { this.props.dataConvert.temp_sensor_4 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 4: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_4 + " °C"}</Text>
                        </View>}

                        { this.props.dataConvert.temp_sensor_5 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 5: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_5 + " °C"}</Text>
                        </View>}

                        { this.props.dataConvert.temp_sensor_6 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 6: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_6 + " °C"}</Text>
                        </View>}

                        { this.props.dataConvert.temp_sensor_7 > -40 && <View style={styles.content_view_item}>
                            <Text>Temp sensor 7: </Text>
                            <Text>{this.props.dataConvert.temp_sensor_7 + " °C"}</Text>
                        </View>}

                        <View style={styles.content_view_item}>
                            <Text>Number of cell: </Text>
                            <Text>{this.props.dataConvert.num_of_cell}</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>Vol cell max: </Text>
                            <Text>{this.props.dataConvert.vol_cell_max/1000 + " V"}</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>Vol cell min: </Text>
                            <Text>{this.props.dataConvert.vol_cell_min/1000 + " V"}</Text>
                        </View>

                        <View style={styles.content_view_item}>
                            <Text>Different vol cell: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_max - this.props.dataConvert.vol_cell_min) + " mV"}</Text>
                        </View>

                        { this.props.dataConvert.num_of_cell > 0 && <View style={styles.content_view_item}>
                            <Text>Vol cell 1: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_1 == 0) ? "No support" : this.props.dataConvert.vol_cell_1/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 1 && <View style={styles.content_view_item}>
                            <Text>Vol cell 2: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_2 == 0) ? "No support"  : this.props.dataConvert.vol_cell_2/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 2 && <View style={styles.content_view_item}>
                            <Text>Vol cell 3: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_3 == 0) ? "No support"  : this.props.dataConvert.vol_cell_3/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 3 && <View style={styles.content_view_item}>
                            <Text>Vol cell 4: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_4 == 0) ? "No support"  : this.props.dataConvert.vol_cell_4/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 4 && <View style={styles.content_view_item}>
                            <Text>Vol cell 5: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_5 == 0) ? "No support"  : this.props.dataConvert.vol_cell_5/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 5 && <View style={styles.content_view_item}>
                            <Text>Vol cell 6: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_6 == 0) ? "No support"  : this.props.dataConvert.vol_cell_6/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 6 && <View style={styles.content_view_item}>
                            <Text>Vol cell 7: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_7 == 0) ? "No support"  : this.props.dataConvert.vol_cell_7/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 7 && <View style={styles.content_view_item}>
                            <Text>Vol cell 8: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_8 == 0) ? "No support"  : this.props.dataConvert.vol_cell_8/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 8 && <View style={styles.content_view_item}>
                            <Text>Vol cell 9: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_9 == 0) ? "No support"  : this.props.dataConvert.vol_cell_9/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 9 && <View style={styles.content_view_item}>
                            <Text>Vol cell 10: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_10 == 0) ? "No support"  : this.props.dataConvert.vol_cell_10/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 10 && <View style={styles.content_view_item}>
                            <Text>Vol cell 11: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_11 == 0) ? "No support"  : this.props.dataConvert.vol_cell_11/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 11 && <View style={styles.content_view_item}>
                            <Text>Vol cell 12: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_12 == 0) ? "No support"  : this.props.dataConvert.vol_cell_12/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 12 && <View style={styles.content_view_item}>
                            <Text>Vol cell 13: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_13 == 0) ? "No support"  : this.props.dataConvert.vol_cell_13/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 13 && <View style={styles.content_view_item}>
                            <Text>Vol cell 14: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_14 == 0) ? "No support"  : this.props.dataConvert.vol_cell_14/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 14 && <View style={styles.content_view_item}>
                            <Text>Vol cell 15: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_15 == 0) ? "No support"  : this.props.dataConvert.vol_cell_15/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 15 && <View style={styles.content_view_item}>
                            <Text>Vol cell 16: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_16 == 0) ? "No support"  : this.props.dataConvert.vol_cell_16/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 16 && <View style={styles.content_view_item}>
                            <Text>Vol cell 17: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_17 == 0) ? "No support"  : this.props.dataConvert.vol_cell_17/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 17 && <View style={styles.content_view_item}>
                            <Text>Vol cell 18: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_18 == 0) ? "No support"  : this.props.dataConvert.vol_cell_18/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 18 && <View style={styles.content_view_item}>
                            <Text>Vol cell 19: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_19 == 0) ? "No support"  : this.props.dataConvert.vol_cell_19/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 19 && <View style={styles.content_view_item}>
                            <Text>Vol cell 20: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_20 == 0) ? "No support"  : this.props.dataConvert.vol_cell_20/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 20 && <View style={styles.content_view_item}>
                            <Text>Vol cell 21: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_21 == 0) ? "No support"  : this.props.dataConvert.vol_cell_21/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 21 && <View style={styles.content_view_item}>
                            <Text>Vol cell 22: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_22 == 0) ? "No support"  : this.props.dataConvert.vol_cell_22/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 22 && <View style={styles.content_view_item}>
                            <Text>Vol cell 23: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_23 == 0) ? "No support"  : this.props.dataConvert.vol_cell_23/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 23 && <View style={styles.content_view_item}>
                            <Text>Vol cell 24: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_24 == 0) ? "No support"  : this.props.dataConvert.vol_cell_24/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 24 && <View style={styles.content_view_item}>
                            <Text>Vol cell 25: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_25 == 0) ? "No support"  : this.props.dataConvert.vol_cell_25/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 25 && <View style={styles.content_view_item}>
                            <Text>Vol cell 26: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_26 == 0) ? "No support"  : this.props.dataConvert.vol_cell_26/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 26 && <View style={styles.content_view_item}>
                            <Text>Vol cell 27: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_27 == 0) ? "No support"  : this.props.dataConvert.vol_cell_27/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 27 && <View style={styles.content_view_item}>
                            <Text>Vol cell 28: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_28 == 0) ? "No support"  : this.props.dataConvert.vol_cell_28/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 28 && <View style={styles.content_view_item}>
                            <Text>Vol cell 29: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_29 == 0) ? "No support"  : this.props.dataConvert.vol_cell_29/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 29 && <View style={styles.content_view_item}>
                            <Text>Vol cell 30: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_30 == 0) ? "No support"  : this.props.dataConvert.vol_cell_30/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 30 && <View style={styles.content_view_item}>
                            <Text>Vol cell 31: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_31 == 0) ? "No support"  : this.props.dataConvert.vol_cell_31/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.num_of_cell > 31 && <View style={styles.content_view_item}>
                            <Text>Vol cell 32: </Text>
                            <Text>{(this.props.dataConvert.vol_cell_32 == 0) ? "No support"  : this.props.dataConvert.vol_cell_32/1000 + " V"}</Text>
                        </View>}

                        { this.props.dataConvert.diagnostic.length > 0 && <View style={styles.content_view_item_diagnostic}>
                            <Text style={styles.text_item_diagnostic_left}>Diagnostic: </Text>
                            <Text style={styles.text_item_diagnostic_right}>{this.getDiagnostic()}</Text>
                        </View>}

                        {/* {
                            this.props.dataConvert.diagnostic.length > 0 &&
                            <View style={styles.content_view_button_bottom}>
                                <TouchableOpacity style={styles.content_button_bottom}
                                    onPress={() => this.props.sendReset()}
                                >
                                    <Text style={styles.text_button_bottom}>RESET</Text>
                                </TouchableOpacity>

                            </View>
                        } */}
                    </ScrollView>
                </View>

                <View style={styles.content_view_action}>
                    <TouchableOpacity
                        style={styles.content_action_button}
                        onPress={() => this.eventClickBackPage()}
                    >
                        <Image style={styles.content_action_button_image} source={require('../assets/images/ic_mopo_back.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    content_view: {
        width: "100%", height: "100%", 
        backgroundColor: "#fff", 
        borderRadius: 10, 
        borderColor: "#000000A0", 
        borderWidth: 1,
        padding: 10,
    },

    content_view_body: {
        flexDirection: "column", 
        width: "100%", height: "100%", 
        alignItems: "center",
    },

    content_view_body_text_name: {
        marginTop: 5, fontSize: 0.06 * width_window, 
        fontWeight: 'bold'
    },

    content_view_body_scroll: {
        flexDirection: "column", 
        width: "100%", height: "100%"
    },

    content_view_action: {
        width: "100%", height: "7%", 
        flexDirection: "row", 
        position: "absolute",
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
        backgroundColor: "#000000a0"
    },

    content_action_button_image: {
        width: "60%", height: "60%"
    },

    content_view_item: {
        flexDirection: "row",
        width: "100%", height: 0.13 * width_window, 
        borderBottomWidth: 1, 
        borderBottomColor: "#aaaaaa", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: 5
    },

    content_view_item_diagnostic: {
        flexDirection: "row", width: "100%",  
        borderBottomWidth: 1, 
        borderBottomColor: "#aaaaaa", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: 5
    },

    text_item_diagnostic_left: {
        textAlignVertical: "top"
    },

    text_item_diagnostic_right: {
        textAlign: "right"
    },

    content_view_button_bottom: {
        flexDirection: "row",
        width: "100%", height: (0.13 * width_window) + (0.06 * width_window),
        justifyContent: "space-between", 
        alignItems: "center",
    },

    content_button_bottom: {
        width: "100%", height: 45, 
        marginTop: 0.06 * width_window, 
        borderRadius: 7, 
        backgroundColor: '#3C7B5E', 
        justifyContent: "center", 
        alignItems: "center"
    },

    text_button_bottom: {
        fontSize: 15, 
        fontWeight: "bold", 
        color: '#fff'
    }
})

function mapStateToProps(state){
    return{
        dataConvert: state.Ble.dataConvert,
        deviceConnected: state.Ble.deviceConnected,
        updateDataState: state.Home.updateDataState,
    };
}

const mapDispatchToProps = dispatch => ({
    sendReset: () => dispatch(sendReset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ParameterViewScreen);