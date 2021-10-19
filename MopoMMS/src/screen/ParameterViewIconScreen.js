import React, {Component} from 'react'
import {View, Text, Dimensions, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux';
import {sendReset} from '../actions/actions'

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

class ParameterViewIconScreen extends Component {
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
        this.props.dataConvert.diagnostic.forEach(el => {
            // str += el.diagnosticTypes + "\n";
            return <View style={styles.content_view_row_item}>
                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_warning.png')} resizeMode="stretch"/>
                <Text style={styles.content_view_row_item_num_cel_pin}>{el}</Text>
            </View>
        });
    }

    getColorCellPin(val){
        if(this.props.dataConvert.position_vol_cell_max == val){
            return "#3c7b5e";
        } else if(this.props.dataConvert.position_vol_cell_min == val){
            return "#ff0000";
        } else {
            return "#aaaaaa";
        }
    }

    render(){
        return(
            <View style={styles.content_view}>

                <View style={styles.content_view_body}>
                    <Text style={styles.content_view_body_text_name}>{this.props.deviceConnected.mac}</Text>

                    <Text style={{height: 1, color: "#00000000", marginTop: "7%"}}>{this.props.updateDataState}</Text>

                    <ScrollView 
                        style={styles.content_view_body_scroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content_view_row_infor}>
                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_vol_meter.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.total_voltage} V</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Total Vol</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_a_meter.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.current} A</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Current</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_fcc.png')} resizeMode="stretch"/>
                                <Text>{(this.props.dataConvert.fcc > -1 ? this.props.dataConvert.fcc/100 : 0) + " Ah"}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>FCC</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_rc.png')} resizeMode="stretch"/>
                                <Text>{(this.props.dataConvert.rc > -1 ? this.props.dataConvert.rc/100 : 0)  + " Ah"}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>RC</Text>
                            </View>
                        </View>

                        <View style={styles.content_view_row_infor}>
                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_percent.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.soc} %</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>SOC</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_soh.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.soh}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>SOH</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_vol_max.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.vol_cell_max/1000 + " V"}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Vmax</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_vol_min.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.vol_cell_min/1000 + " V"}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Vmin</Text>
                            </View>
                        </View>

                        <View style={styles.content_view_row_infor}>
                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_different.png')} resizeMode="stretch"/>
                                <Text>{(this.props.dataConvert.vol_cell_max - this.props.dataConvert.vol_cell_min) + " mV"}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Dif Vol</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_cycle.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.cycle_count}</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Cycle</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_max.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.temp_max} °C</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Tmax</Text>
                            </View>

                            <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_min.png')} resizeMode="stretch"/>
                                <Text>{this.props.dataConvert.temp_min} °C</Text>
                                <Text style={styles.content_view_row_item_color_description_infor}>Tmin</Text>
                            </View>
                        </View>

                        { this.props.dataConvert.num_of_cell > 0 && <View style={styles.content_view_row_cel_pin}>
                            {this.props.dataConvert.num_of_cell > 0 && <View style={styles.content_view_row_item}> 
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(1)}]}>{this.props.dataConvert.vol_cell_1 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>1</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 1 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(2)}]}>{this.props.dataConvert.vol_cell_2 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>2</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 2 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(3)}]}>{this.props.dataConvert.vol_cell_3 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>3</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 3 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(4)}]}>{this.props.dataConvert.vol_cell_4 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>4</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 4 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 4 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(5)}]}>{this.props.dataConvert.vol_cell_5 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>5</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 5 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(6)}]}>{this.props.dataConvert.vol_cell_6 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>6</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 6 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(7)}]}>{this.props.dataConvert.vol_cell_7 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>7</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 7 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(8)}]}>{this.props.dataConvert.vol_cell_8 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>8</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 8 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 8 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(9)}]}>{this.props.dataConvert.vol_cell_9 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>9</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 9 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(10)}]}>{this.props.dataConvert.vol_cell_10 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>10</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 10 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(11)}]}>{this.props.dataConvert.vol_cell_11 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>11</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 11 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(12)}]}>{this.props.dataConvert.vol_cell_12 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>12</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 12 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 12 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(13)}]}>{this.props.dataConvert.vol_cell_13 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>13</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 13 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(14)}]}>{this.props.dataConvert.vol_cell_14 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>14</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 14 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(15)}]}>{this.props.dataConvert.vol_cell_15 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>15</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 15 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(16)}]}>{this.props.dataConvert.vol_cell_16 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>16</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 16 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 16 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(17)}]}>{this.props.dataConvert.vol_cell_17 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>17</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 17 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(18)}]}>{this.props.dataConvert.vol_cell_18 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>18</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 18 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(19)}]}>{this.props.dataConvert.vol_cell_19 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>19</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 19 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(20)}]}>{this.props.dataConvert.vol_cell_20 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>20</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 20 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 20 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(21)}]}>{this.props.dataConvert.vol_cell_21 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>21</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 21 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(22)}]}>{this.props.dataConvert.vol_cell_22 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>22</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 22 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(23)}]}>{this.props.dataConvert.vol_cell_23 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>23</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 23 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(24)}]}>{this.props.dataConvert.vol_cell_24 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>24</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 24 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 24 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(25)}]}>{this.props.dataConvert.vol_cell_25 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>25</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 25 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(26)}]}>{this.props.dataConvert.vol_cell_26 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>26</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 26 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(27)}]}>{this.props.dataConvert.vol_cell_27 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>27</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 27 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(28)}]}>{this.props.dataConvert.vol_cell_28 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>28</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.num_of_cell > 28 && <View style={styles.content_view_row_cel_pin}>
                            { this.props.dataConvert.num_of_cell > 28 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(29)}]}>{this.props.dataConvert.vol_cell_29 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>29</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 29 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(30)}]}>{this.props.dataConvert.vol_cell_30 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>30</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 30 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(31)}]}>{this.props.dataConvert.vol_cell_31 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>31</Text>
                            </View>}

                            { this.props.dataConvert.num_of_cell > 31 && <View style={styles.content_view_row_item}>
                                <Text style={[styles.content_view_row_item_val_cel_pin, {color: this.getColorCellPin(32)}]}>{this.props.dataConvert.vol_cell_32 + " mV"}</Text>
                                <Text style={styles.content_view_row_item_num_cel_pin}>32</Text>
                            </View>}
                        </View>}

                        <View style={styles.content_view_row_temp}>
                            { this.props.dataConvert.temp_sensor_1 > -40 && <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_sensor.png')} resizeMode="stretch"/>
                                <Text style={styles.content_view_row_item_num_cel_pin}>{this.props.dataConvert.temp_sensor_1 + " °C"}</Text>
                            </View>}

                            { this.props.dataConvert.temp_sensor_2 > -40 && <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_sensor.png')} resizeMode="stretch"/>
                                <Text style={styles.content_view_row_item_num_cel_pin}>{this.props.dataConvert.temp_sensor_2 + " °C"}</Text>
                            </View>}

                            { this.props.dataConvert.temp_sensor_3 > -40 && <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_sensor.png')} resizeMode="stretch"/>
                                <Text style={styles.content_view_row_item_num_cel_pin}>{this.props.dataConvert.temp_sensor_3 + " °C"}</Text>
                            </View>}
                        </View>

                        {this.props.dataConvert.temp_sensor_4 > -40 && <View style={styles.content_view_row_temp}>
                            { this.props.dataConvert.temp_sensor_4 > -40 && <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_sensor.png')} resizeMode="stretch"/>
                                <Text style={styles.content_view_row_item_num_cel_pin}>{this.props.dataConvert.temp_sensor_4 + " °C"}</Text>
                            </View>}

                            { this.props.dataConvert.temp_sensor_5 > -40 && <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_sensor.png')} resizeMode="stretch"/>
                                <Text style={styles.content_view_row_item_num_cel_pin}>{this.props.dataConvert.temp_sensor_5 + " °C"}</Text>
                            </View>}

                            { this.props.dataConvert.temp_sensor_6 > -40 && <View style={styles.content_view_row_item}>
                                <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_temp_sensor.png')} resizeMode="stretch"/>
                                <Text style={styles.content_view_row_item_num_cel_pin}>{this.props.dataConvert.temp_sensor_6 + " °C"}</Text>
                            </View>}
                        </View>}

                        { this.props.dataConvert.diagnostic.length > 0 && <View style={styles.content_view_row_item}>
                            { this.props.dataConvert.diagnostic.map((item, key) => { 
                                        return <View key={key} style={{flexDirection: "row", alignItems: "center"}}>
                                            <Image style={styles.content_view_item_size_image} source={require('../assets/img_paremeter_view/ic_mopo_warning.png')} resizeMode="stretch"/>
                                            <Text style={styles.content_view_row_item_num_cel_pin}>{item.diagnosticTypes}</Text>
                                        </View>
                                    }
                                )
                            }
                        </View>}
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
        backgroundColor: "#eeeeee"
    },

    content_view_body: {
        flexDirection: "column", 
        width: "100%", height: "100%", 
        alignItems: "center",
        backgroundColor: "#eeeeee"
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

    content_view_row_infor: {
        flexDirection: "row", width: "100%", height: 100, marginBottom: 15
    },

    content_view_row_cel_pin: {
        flexDirection: "row", width: "100%", height: 50, marginBottom: 15
    },

    content_view_row_temp: {
        flexDirection: "row", width: "100%", height: 70, marginBottom: 15
    },

    content_view_row_item: {
        flex: 1, 
        flexDirection: "column", 
        height: "100%", 
        marginLeft: 5, 
        marginRight: 5, 
        borderRadius: 7, 
        backgroundColor: "#fff", 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingTop: 5, 
        paddingBottom: 5
    },

    content_view_row_item_color_description_infor:{
        color: "#aaaaaa"
    },

    content_view_item_size_image: {
        width: 32, height: 32
    },

    content_view_row_item_val_cel_pin: {
        fontWeight: "bold"
    },

    content_view_row_item_num_cel_pin: {
        fontWeight: "bold"
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(ParameterViewIconScreen);