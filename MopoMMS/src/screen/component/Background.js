import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native'

const width_window = Dimensions.get('window').width;
const height_window= Dimensions.get('window').height;

export default function Background(){
    
    return(
        <View style={styles.content_main}>
            <Image style={styles.image_background} source={require('../../assets/images/background_mopo_2.jpg')} resizeMode="stretch"/>
            <View style={{width: "100%", height: 20, backgroundColor: "#00000090", position: "absolute"}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    content_main: {
        width: width_window, height: height_window, position: "absolute"
    },

    image_background: {
        width: width_window, height: height_window
    },
})