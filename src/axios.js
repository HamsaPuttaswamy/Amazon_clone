 import axios from "axios";

 const instance = axios.create({
    baseURL: 'https://us-central1-clone-8d647.cloudfunctions.net/api' 
    // 'http://localhost:5001/clone-23-46b2b/us-central1/api' //API URL
 });

 export default instance;