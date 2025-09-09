const BASE_URL = import.meta.env.VITE_API_URL;
debugger;
console.log("Loaded BASE_URL:", BASE_URL); 
console.log("TEST VAR:", import.meta.env.VITE_TEST);

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;
export const CATEGORY_API_END_POINT = `${BASE_URL}/category`;
export const ADMIN_API_END_POINT = `${BASE_URL}/admin`;
export const CONTACT_API_END_POINT = `${BASE_URL}/contact`;

