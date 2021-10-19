import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {connect} from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import {roundNumber} from '../utils/utilConfig';
import ValueStrings from "../utils/Strings";

let { width, height } = Dimensions.get('window');

class MapsScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            myLocation: {
                latitude: 0,
                longitude: 0,
            },
            locaDerection: {
                latitude: 0,
                longitude: 0,
            },
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05 * (width / height),
            },
            listStations: [],
            showInforStation: false,
            showLineDerection: false,
            showMenuSelectStation: false,
            flagMyLocation: false,
            listStationsTam: [],
            markerDeretion: {},
            distance: 0,
            duration: 0,
            menuSelected: 0,
            itemMenu: [
                "All stations",
                "Exchange station",
                "Charging station",
                "Service station",
                "All service station",
            ],
        };
    }

    componentDidMount() {
        this.watchID = Geolocation.getCurrentPosition((position) => {
            this.setRegion({
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.05,
                longitudeDelta: 0.05 * (width / height),
            });
            this.setMyLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            this.findStationsByLocal(position.coords.latitude, position.coords.longitude);
        }, (error)=>console.log(error));
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }
    
    async findStationsByLocal (my_latitude, my_longitude) {
        try {
            let response = await fetch(
                ValueStrings.BASE_URL + ValueStrings.findStations,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from_lat: my_latitude - 0.3,
                        from_lng: my_longitude - 0.3,
                        to_lat: my_latitude + 0.3,
                        to_lng: my_longitude + 0.3,
                        lang: "EN"
                    })
                }
            );
            var json = await response.json();
            if(this.state.menuSelected == 1){
                json = json.d.filter(el => el.Station_Type_Img === '/StationType/stationType-1.png')
            } else if(this.state.menuSelected == 2){
                json = json.d.filter(el => el.Station_Type_Img === '/StationType/stationType-2.png')
            } else if(this.state.menuSelected == 3){
                json = json.d.filter(el => el.Station_Type_Img === '/StationType/stationType-3.png')
            } else if(this.state.menuSelected == 4){
                json = json.d.filter(el => el.Station_Type_Img === '/StationType/stationType-4.png')
            } else {
                json = json.d;
            }
            this.setState({
                listStations: json,
            })
        } catch (error) {
            console.error(error);
        }
    };
    
    showInformationStation(marker){
        this.setFlagGetCurrent();
        this.setRegion({
            latitude: marker.GPS_Info_Lat, 
            longitude: marker.GPS_Info_Lng, 
            latitudeDelta: this.state.region.latitudeDelta, 
            longitudeDelta: this.state.region.longitudeDelta
        });
        this.setLocaDerection({
            latitude: marker.GPS_Info_Lat, 
            longitude: marker.GPS_Info_Lng,
        })
        this.setFlagShowInforStation(true);
        this.setState({
            markerDeretion: marker
        });
    }
    
    setRegion(region){
        this.setState({
            region: region
        });
    }
    
    setFlagShowInforStation(val){
        this.setState({
            showInforStation: val
        })
    }

    setFlagShowMenuSelectStation(val){
        this.setState({
            showMenuSelectStation: val
        })
    }

    setFlagMyLocation(val){
        this.setState({
            flagMyLocation: val
        })
    }
    
    setFlagShowLineDerection(val){
        this.setState({
            showLineDerection: val
        })

        if(!val){
            this.setState({
                distance: 0,
                duration: 0,
            });
            this.findStationsByLocal(this.state.myLocation.latitude, this.state.myLocation.longitude);
        } else {
            this.setState({
                listStationsTam: this.state.listStations,
                listStations: [this.state.markerDeretion],
            })
        }
    }
    
    setMyLocation(myLocation){
        this.setState({
            myLocation: myLocation
        })
    }
    
    setLocaDerection(locaDerection){
        this.setState({
            locaDerection: locaDerection
        })
    }

    setMenuSelected(val){
        if(this.state.menuSelected != val){
            this.setState({
                menuSelected: val,
            });
            this.findStationsByLocal(this.state.myLocation.latitude, this.state.myLocation.longitude);
        }
        this.setFlagShowMenuSelectStation(false);
    }

    showItemMenuSelected(){
        return this.state.itemMenu[this.state.menuSelected];
    }
    
    showLineDerection(val){
        if(val){
            return <MapViewDirections
                origin={this.state.myLocation}
                destination={this.state.locaDerection}
                apikey={ValueStrings.KEY_API_DIRECTION}
                strokeWidth={5}
                strokeColor="#3C7B5E"
                onReady={result => {
                    this.setDirectionInfor(result.distance, result.duration)
                }}
            />
        }
    }

    setDirectionInfor(distance, duration){
        this.setState({
            distance: roundNumber(distance, 1),
            duration: roundNumber(duration, 0),
        });
    }

    onRegionCurrent(region) {
        if(!this.state.flagMyLocation){
            this.setRegion({
                latitude:       region.latitude,
                longitude:      region.longitude,
                latitudeDelta:  region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
            })
        }
    }

    setFlagGetCurrent(){
        this.setFlagMyLocation(true);
        setTimeout(() => {this.setFlagMyLocation(false);}, 1000);
    }

    getMylocation(){
        this.setFlagGetCurrent();
        Geolocation.getCurrentPosition((position) => {
            this.setRegion({
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.05,
                longitudeDelta: 0.05 * (width / height),
            });
            this.setMyLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }, (error)=>console.log(error));
    }

    getIconMarker(strIcon){
        if(strIcon === '/StationType/stationType-1.png'){
            return require('../assets/img_map_marker/stationType-1.png')
        } else if(strIcon === '/StationType/stationType-2.png') {
            return require('../assets/img_map_marker/stationType-2.png')
        } else if(strIcon === '/StationType/stationType-3.png') {
            return require('../assets/img_map_marker/stationType-3.png')
        } else if(strIcon === '/StationType/stationType-4.png') {
            return require('../assets/img_map_marker/stationType-4.png')
        }
    }

    renderInformaitonStation(val){
        if(val){
            return <View style={styles.content_view_infor_marker}>
                <Text style={styles.content_view_title_infor_marker}>{this.state.markerDeretion.Shop_Name}</Text>
                <Text style={styles.content_view_address_infor_maker}>{this.state.markerDeretion.Address}</Text>
                
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{flex: 1, flexDirection: "column"}}>
                        <Text style={styles.content_view_address_infor_maker}>Phone: {this.state.markerDeretion.Phone_Number}</Text>
                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Image style={styles.content_image_derection} source={require('../assets/images/ic_mopo_derection.png')} resizeMode="stretch"/>
                            <Text style={{color: "#fff", fontSize: 16}}>{this.state.duration} mins </Text>
                            <Text style={{color: "#fff", fontSize: 16}}>({this.state.distance} km)</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: "column", alignItems: "flex-end"}}>
                        <TouchableOpacity
                            style={{flexDirection: "row", width: 110, height: 40, backgroundColor: "#fff", borderRadius: 7, justifyContent: "space-between", alignItems: "center", padding: 2}}
                            onPress={()=>this.setFlagShowLineDerection(true)}
                        >
                            <Text style={{marginLeft: 3, color: "#3C7B5E"}}>Directions</Text>
                            <Image style={styles.content_image_derection} source={require('../assets/images/ic_mopo_direction.png')} resizeMode="stretch"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width: "100%", alignItems: "center"}}>
                    <TouchableOpacity
                        style={{flexDirection: "row", width: width * 0.2, height: 24, borderRadius: 7, justifyContent: "center", alignItems: "center", padding: 2}}
                        onPress={()=> {this.setFlagShowInforStation(false); this.setFlagShowLineDerection(false)}}
                    >
                        <Image style={styles.content_image_derection} source={require('../assets/images/ic_mopo_hide.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
                </View>
            </View>
        }
    }

    renderMenuStation(val){
        if(val){
            return  <View style={{flexDirection: 'column',width: width - 40, height: "100%", position: "absolute"}}>
                <View style={styles.content_view_menu}>
                    <TouchableOpacity 
                        style={styles.content_view_button_menu}
                        onPress={() => this.setMenuSelected(0)}
                    >
                        <Text style={styles.content_view_text_menu}>{this.state.itemMenu[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.content_view_button_menu}
                        onPress={() => this.setMenuSelected(1)}
                    >
                        <Text style={styles.content_view_text_menu}>{this.state.itemMenu[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.content_view_button_menu}
                        onPress={() => this.setMenuSelected(2)}
                    >
                        <Text style={styles.content_view_text_menu}>{this.state.itemMenu[2]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.content_view_button_menu}
                        onPress={() => this.setMenuSelected(3)}
                    >
                        <Text style={styles.content_view_text_menu}>{this.state.itemMenu[3]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.content_view_button_menu}
                        onPress={() => this.setMenuSelected(4)}
                    >
                        <Text style={styles.content_view_text_menu}>{this.state.itemMenu[4]}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{width: "100%", height: "100%", backgroundColor: "#00000000"}}
                    onPress={() => this.setFlagShowMenuSelectStation(false)}/>
            </View>
        }
    }
    

    render() {
        return (
            <View style={styles.content}>
                <MapView
                    provider={ PROVIDER_GOOGLE }
                    style={ styles.container }
                    showsUserLocation={true}
                    region={ this.state.region }
                    onRegionChangeComplete={(val) => this.onRegionCurrent(val)}
                >
                
                {this.showLineDerection(this.state.showLineDerection)}
        
                
                {this.state.listStations.map((marker, index) => (
                    <Marker
                        key={index}
                        style={styles.content_view_image_marker}
                        // image={{uri: "https://mopo-app.mopolife.com" + marker.Station_Type_Img}}
                        image={this.getIconMarker(marker.Station_Type_Img)}
                        coordinate={{
                            latitude: marker.GPS_Info_Lat,
                            longitude: marker.GPS_Info_Lng,
                        }}
                        title={marker.Shop_Name}
                        onPress={() => this.showInformationStation(marker)}
                    />
                ))}
                </MapView>
        
                <View style={styles.content_view_search}>
                    <View style={styles.content_view_select_menu}>
                        <TouchableOpacity
                            style={styles.content_view_button_select_menu}
                            onPress={() => this.setFlagShowMenuSelectStation(true)}
                        >
                            <Text style={styles.content_view_text_select_menu}>{this.showItemMenuSelected()}</Text>
                        </TouchableOpacity>
                    </View>

                    {this.renderInformaitonStation(this.state.showInforStation)}
                </View>

                <View style={styles.content_view_my_location}>
                    <TouchableOpacity
                        style={styles.content_button_my_location}
                        onPress={() => this.getMylocation()}
                    >
                        <Image style={styles.content_image_my_location} source={require('../assets/images/ic_mopo_my_location.png')} resizeMode="stretch"/>
                    </TouchableOpacity>
                </View>

                {this.renderMenuStation(this.state.showMenuSelectStation)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1, 
        width: "100%", height: "100%", 
        alignItems: 'center', 
        borderRadius: 10, 
        padding: 2
    },

    container: {
        height: '100%',
        width: '100%',
        marginBottom: 0,
        paddingBottom: 0
    },

    content_view_image_marker: {
        width: 10, height: 10
    },

    content_view_search: {
        width: width - 40, 
        flexDirection: "column",
        backgroundColor: "#3C7B5E", 
        borderRadius: 10, 
        borderWidth: 1,
        borderColor: "#fff",
        marginTop: 10,
        position: "absolute",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },

    content_view_infor_marker: {
        width: "100%", 
        flexDirection: "column"
    },

    content_view_title_infor_marker: {
        width: "100%", 
        fontWeight: "bold",
        color: "#fff", 
        fontSize: 20
    },

    content_view_address_infor_maker: {
        width: "100%",
        color: "#fff", 
        fontSize: 16
    },

    content_view_select_menu: {
        width: "100%", height: 30, 
        backgroundColor: "#fff", 
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: "#DDDDDD",
        marginBottom: 10,
    },

    content_view_button_select_menu: {
        flexDirection: "row",
        width: "100%", height: "100%", 
        alignItems: "center"
    },

    content_view_text_select_menu: {
        width: "100%", marginLeft: 5, fontSize: 16
    },

    content_view_menu: {
        width: width - 40,
        flexDirection: "column",
        backgroundColor: "#FFF", 
        borderRadius: 10, 
        borderWidth: 1,
        borderColor: "#fff",
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

    content_view_button_menu: {
        flexDirection: "row",
        width: "100%", height: 40, 
        borderBottomWidth: 1, 
        borderBottomColor: "#DDDDDD", 
        alignItems: "center"
    },

    content_view_text_menu: {
        width: "100%", margin: 5, 
        fontSize: 16
    },

    content_image_derection: {
        width: 24,
        height: 24,
        marginRight: 10
    },

    content_view_my_location: {
        width: 45, height: 45, 
        marginRight: 10, 
        marginTop: -55, 
        alignSelf: "flex-end"
    },

    content_button_my_location: {
        width: "100%", height: "100%", 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#fff", 
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 10,
    },

    content_image_my_location: {
        width: 25,
        height: 25,
    },
})

// function mapStateToProps(state){
//     return{
//         regionCurrent: state.XX.regionCurrent,
//     };
// }

// const mapDispatchToProps = dispatch => ({
//     set_region_current: (val) => dispatch(set_region_current(val)),
// })

export default connect(null, null)(MapsScreen);