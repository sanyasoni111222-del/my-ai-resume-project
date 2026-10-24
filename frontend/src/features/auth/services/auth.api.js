import api, { setToken } from "../../../lib/api.js";


export async function register({username,email,password}){
     const response = await api.post('/api/auth/register' ,{
        username, email, password
    })

    if (response.data?.token) setToken(response.data.token)
    return response.data
}


export async function login ({email,password}){
    const response = await api.post("/api/auth/login" ,{
        email,password
    })

    if (response.data?.token) setToken(response.data.token)
    return response.data
}

export async function logout(){
    try{
        const response = await api.get("/api/auth/logout",{
             

        })
        return response.data
    } catch (err) {


    } finally {
        setToken(null)
    }
}
export async function getMe(){
    try{
        const response = await api.get("/api/auth/get-me",{
     })
        return response.data
    }catch(err){
        console.log(err)
    }
}
