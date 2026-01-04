import axios from "axios";

// APNE LAPTOP KA IP ADDRESS DALO (Command prompt mein 'ipconfig' likh kar check karo)
const BASE_URL = "http://192.168.1.23:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
