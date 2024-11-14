const BASE_URL = "http://localhost:8080/api";

const LOGIN_ENDPOINT = BASE_URL + '/user/google-login';
const GET_CUSTOMER_BY_ID_ENDPOINT = `${BASE_URL}/customer`;
const CREATE_SEGMENT_ENDPOINT = BASE_URL + '/segment';

export {
    BASE_URL,
    LOGIN_ENDPOINT,
    GET_CUSTOMER_BY_ID_ENDPOINT,
    CREATE_SEGMENT_ENDPOINT
}