// import { loginByUserName, applyLogin } from '../api/login';
// import * as types from './mutation-type';
// import * as storage from '@/utils/storage';
// import store from "../store"
// import { RSAEncryption } from '@/services';
//
// export default {
//     LoginByUserName ({ commit }, userInfo) {
//         return new Promise((resolve, reject) => {
//             let obj = {
//                 ...userInfo,
//                 login_name: userInfo.user_name,
//                 pwd: RSAEncryption(md5(userInfo.pwd)),
//                 is_client: store.state.loginType === 'app' ? '1' : ''
//             };
//             loginByUserName(obj).then(({ data }) => {
//                 if (data.status) {
//                     commit(types['SAVE_LOGIN_INFO'], data);
//                 }
//                 resolve(data);
//             }).catch(error => {
//                 reject(error);
//             });
//         });
//     },
// };
