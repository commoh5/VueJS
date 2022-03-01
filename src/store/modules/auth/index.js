import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default{  
  state() {
    return {
      token: null,
      userId: null,
      //tokenExpiration: null,
      didAutoLogout: false
    };
  },  
  mutations,
  getters,
  actions
}