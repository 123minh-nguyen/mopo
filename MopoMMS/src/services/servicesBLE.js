export function getService(strServices){
    return new Promise(async (resolve, reject) => {
        try{
            if(strServices != null){
                strServices.forEach(element => {
                    if(element.uuid === 'eeeeeee0-eeee-eeee-eeee-eeeeeeeeeeee'){
                        resolve({
                            services: 'eeeeeee0-eeee-eeee-eeee-eeeeeeeeeeee',
                            notify: 'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee',
                            write: 'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee'
                        });
                    } else if(element.uuid === '0000ffe0-0000-1000-8000-00805f9b34fb'){
                        resolve({
                            services: '0000ffe0-0000-1000-8000-00805f9b34fb',
                            notify: '0000ffe1-0000-1000-8000-00805f9b34fb',
                            write: '0000ffe2-0000-1000-8000-00805f9b34fb'
                        });
                    } else if(element.uuid === '0000ff00-0000-1000-8000-00805f9b34fb'){
                        resolve({
                            services: '0000ff00-0000-1000-8000-00805f9b34fb',
                            notify: '0000ff01-0000-1000-8000-00805f9b34fb',
                            write: '0000ff02-0000-1000-8000-00805f9b34fb'
                        });
                    }
                });
            }
        } catch (e){
            reject(e);
        }
    })
}