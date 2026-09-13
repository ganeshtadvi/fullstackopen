import axios from 'axios'

const baseurl='http://localhost:8000/api/login'

const loginService=async(credentials)=>{
    const response=await axios.post(baseurl,credentials)
    return response.data
}



export default loginService