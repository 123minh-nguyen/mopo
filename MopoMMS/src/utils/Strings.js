
const ValueStrings = {
    BASE_URL: "https://mopo-app.mopolife.com",
    API_LOGIN: "/API.aspx/Login",
    API_REGISTER: "/API.aspx/Register",
    API_PASSWORD_RESET: "/API.aspx/Reset_Password",
    API_CHANGE_PASSWORD: "/API.aspx/Update_Password",
    findStations: "/API.aspx/findStationsByLocal",
    KEY_API_DIRECTION: 'AIzaSyDlfPvsa3WqJpuksbGvqYz0eF5d1VHY4eQ',

    // type message error
    ms_disconnect: 'Disconnect',
    ms_bms_warning: 'BMS warning',
    ms_error: 'Error system',
    // type message xiaoxiang error
    ms_difference_voltage: 'Difference Voltage',
    ms_under_voltage_protection: 'Under Voltage Protection',
    ms_over_voltage_protection: 'Over Voltage Protection',
    ms_system_error: 'System Error',
    ms_over_or_under_tem_potect: 'Over Or Under Temperature Potect',
    ms_system_error_auto_return: 'System Error And Auto Return',

    // message
    can_not_turn_on_device: 'Can`t turn on output device.',
    can_not_connect_device: 'Can`t connect device.',
    can_not_find_device: 'Can`t find device.',
    disconnect_device: 'Disconnect device.',
    bms_disconnected_bluetooth: 'BMS disconnected bluetooth.',
    connect_device_please: 'Please connect device.',
    can_not_control_output: 'Can`t control output.',
    processing: 'Processing ...',
    connecting: 'Connecting, please wait a moment!',
    // message xiaoxiang
    difference_voltage: 'The system is not balance, please contact service center.',
    under_voltage_protection: 'The system cannot discharge, please plug in the charger immediately.',
    system_error: 'The system is error, please remove charger/ load and contact service center.',
    over_or_under_tem_potect: 'Pack is over/ under temperature during operating, the system will turn OFF automaticaly to protect and turn ON again once the temperature decrease/ increase to safe range. Do you want to turn OFF system immediately?',
    system_error_auto_return: 'The system found something abnormal and try to fix, please do not quit App.',

    // style alert
    connect_device: 'connect_device',
    toast_maketext: 'toast_maketext',
    warning: 'warning',
    warning_question: 'warning_question',
    success: 'success',
    process: 'processing',
    save_mac_battery: 'save_mac_battery',
    notify_question: 'notify_question',

    // Key Async Storage
    list_mac_save: 'list_mac_save',
    key_pre_login: 'key_pre_login',
    key_is_login: 'key_is_login',
    key_notification: 'key_notification',
    key_is_connect_multi: 'key_is_connect_multi',
    key_last_connected_device: 'key_last_connected_device',
    // 


    // Version App
    version_app: "Mopo MMS version 1.0",
    //
}

export default ValueStrings;