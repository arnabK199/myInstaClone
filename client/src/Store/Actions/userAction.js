export const loginUser = (user) => {
    return{
        type: 'USER_LOGIN',
        payload: user
    }
}

export const authStart = () => {
    return dispatch =>{
        const token = localStorage.getItem('jwt')
        if(token){
            const email = localStorage.getItem('email')
            const password = localStorage.getItem('password')

            fetch('/signin', {
                method:'POST',
                headers:{
                    'Content-Type':'Application/json'
                },
                body:JSON.stringify({
                    email,
                    password
                })
            })
            .then(res => res.json())
            .then(data => {
                dispatch(loginUser(data.user))
            })
        }
    } 
}

export const logoutUser = (user) => {
    return{
        type: 'USER_LOGOUT',
        payload: null
    }
}

export const updateUser = (payload) => {
    return{
        type:'USER_UPDATE',
        payload
    }
}

export const updateProfilePic = pic => {
    return{
        type:'USER_UPDATE_PROFILEPIC',
        payload:pic
    }
}