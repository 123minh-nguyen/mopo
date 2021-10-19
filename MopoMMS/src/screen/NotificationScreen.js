import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, FlatList, Dimensions} from 'react-native'
import {connect} from 'react-redux';
import {updateReadListNotify} from '../actions/action_home'

class NotificationScreen extends Component {
    constructor(props){
        super(props)
        this.props.updateReadListNotify();
    }

    render(){
        return(
            <View style={styles.content}>
                <FlatList 
                    data = {this.props.listNotify}
                    renderItem={({item}) => (
                        <View style={styles.item_view_button}>
                            <Image style={styles.item_view_image} source={item.type_msg == 1 ? require('../assets/images/ic_mopo_warning.png') : require('../assets/images/ic_mopo_error.png')} resizeMode="stretch"/>
                            <View style={styles.item_view_content}>
                                <Text style={styles.item_view_content_text_title}>{item.title}</Text>
                                <Text style={styles.item_view_content_text_body}>{item.message}</Text>
                                <View style={styles.item_view_content_mac}>
                                    <Text style={styles.item_view_content_mac_text}>Mac device: </Text>
                                    <Text style={styles.item_view_content_text_body}>{item.macs}</Text>
                                </View>
                                <View style={styles.item_view_content_date_time}>
                                    <View/>
                                    <Text>{item.time}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'column',
        width: "100%", height: "100%", 
        padding: 10
    },

    item_view_content: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },

    item_view_button: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#fff",
    },

    item_view_image: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },

    item_view_content:{
        flexDirection: "column", width: "100%", padding: 7
    },

    item_view_content_mac: {
        flexDirection: "row", marginTop: 5
    },

    item_view_content_mac_text: {
        fontWeight: "bold"
    },

    item_view_content_text_title: {
        fontSize: 17, width: Dimensions.get('window').width - 110, fontWeight: "bold"
    },

    item_view_content_text_body: {
        width: Dimensions.get('window').width - 110,
    },

    item_view_content_date_time: {
        flexDirection: "row", width: Dimensions.get('window').width - 110, justifyContent: "space-between", marginTop: 5
    }
})

function mapStateToProps(state){
    return{
        listNotify: state.Home.listNotify,
        accountInfo: state.Home.accountInfo,
    };
}

const mapDispatchToProps = dispatch => ({
    updateReadListNotify: () => dispatch(updateReadListNotify()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);