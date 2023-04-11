import {env} from './../env';


const Config = {
  // LOCAL IP
  // baseUrl: "http://localhost:3011/api",
  // DEV LOCAL
  appTitle: `${env.REACT_APP_TITLE}`,
  appVersion: `${env.REACT_APP_VERSION}`,
  baseUrl: `${env.REACT_APP_BASE_URL}`,
  // DEV PUBLIC
  // baseUrl: "http://124.109.39.158:3011/api",
  // baseUrl: "http://202.69.62.51:3011/api",
  // Production IP Domain
  // baseUrl: "https://dregistry.dccl.com.pk:3011/api",
  // PTCL Development
  // baseUrl: "http://182.191.93.242:3011/api",
  // KARACHI UAT
  // baseUrl: "http://124.109.39.158:3011/api",
  socketBaseUrl:`${env.REACT_APP_SOCKET_URL}` , //deployed
  imageBaseUrl: `${env.REACT_APP_IMAGE_URL}`, //forimage
  authBaseUrl: `${env.REACT_APP_AUTH_URL}`,

  // VPS
  // baseUrl: "http://167.86.69.108:3000/api", //deployed
  // socketBaseUrl: "http://167.86.69.108:3000/", //deployed
  // imageBaseUrl: "http://167.86.69.108:3000/", //forimage
};
export default Config;

// const Config = {
//   // LOCAL IP
//   // baseUrl: "http://localhost:3011/api",
//   // DEV LOCAL
//   baseUrl: "http://192.168.18.220:3011/api",
//   // DEV PUBLIC
//   // baseUrl: "http://124.109.39.158:3011/api",
//   // baseUrl: "http://202.69.62.51:3011/api",
//   // Production IP Domain
//   // baseUrl: "https://dregistry.dccl.com.pk:3011/api",
//   // PTCL Development
//   // baseUrl: "http://182.191.93.242:3011/api",
//   // KARACHI UAT
//   // baseUrl: "http://124.109.39.158:3011/api",
//   socketBaseUrl: "http://182.191.93.242:3000/", //deployed
//   imageBaseUrl: "http://182.191.93.242:3000/", //forimage

//   // VPS
//   // baseUrl: "http://167.86.69.108:3000/api", //deployed
//   // socketBaseUrl: "http://167.86.69.108:3000/", //deployed
//   // imageBaseUrl: "http://167.86.69.108:3000/", //forimage
// };
// export default Config;
