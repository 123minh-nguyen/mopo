const model = {
    dataByteArray: [],
};
  
const XXReducer = (state = model, action) => {
    switch (action.type) {   
        case 'ADD_BYTE_ARRAY_BASE_INFOR':
            state = { 
                ...state, 
                dataByteArray: action.byteArray
            }
            break;
        case 'CLEAR_BYTE_ARRAY_BASE_INFOR':
            state = { 
                ...state, 
                dataByteArray: []
            }
            break;
    }
    return state;
};

export default XXReducer;