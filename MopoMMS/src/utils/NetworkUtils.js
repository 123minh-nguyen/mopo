import NetInfo from "@react-native-community/netinfo";
class NetworkUtils {
    async isNetworkAvailable() {
        const response = await NetInfo.fetch();
        console.log("NetworkUtils: " + response.isConnected);
        return response.isConnected;
    }
}

export default NetworkUtils;