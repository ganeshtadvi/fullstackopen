import axios from 'axios'

const baseUrl="http://localhost:3001/persons"


const getAllContacts=()=>{
const request=axios.get(baseUrl)
return request.then(response=>response.data)
}

const saveContact=(contactObj)=>{
    const request=axios.post(baseUrl,contactObj)
    return  request.then((response=>response.data))
}

const updateContact=(id,newObj)=>{
    const request=axios.put(`${baseUrl}/${id}`,newObj)
    return request.then(response=>response.data)
}

 const deleteContact=(id)=>{
    const request= axios.delete(`${baseUrl}/${id}`)
    return request.then(response=>response.data)
}

export default{
    getAllContacts,
    saveContact,
    deleteContact,
    updateContact
}