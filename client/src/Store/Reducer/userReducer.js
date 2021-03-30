const instialState= null;

const reducer = (state = instialState , action) => {
    switch(action.type){
        case 'USER_LOGIN':
            return action.payload
        case 'USER_LOGOUT':
            return action.payload
        case 'USER_UPDATE':
            return {
                ...state,
                followers: action.payload.followers,
                following: action.payload.following
            }
        case 'USER_UPDATE_PROFILEPIC':
            return{
                ...state,
                pic: action.payload
            }
        default:
            return state
    }
}

export default reducer;