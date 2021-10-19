import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';

export default function DeviceItemList({item, connectDeviceItem}){
    return(
        <TouchableOpacity style={{width: "100%", height: 55}} onPress={() => connectDeviceItem(item)}>
            <View style={{flexDirection: "column", padding: 5, borderBottomWidth: 1, borderColor: "#ffffff50", borderStyle: 'dashed'}}>
                <Text style={styles.item}>{item.name}</Text>
                <Text style={styles.item_1}>{item.id}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        width: "100%", 
        textAlignVertical: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },

    item_1: {
        width: "100%", 
        textAlignVertical: "center",
        fontSize: 15,
        color: "#ffffffA0"
    },
})