let timer;

export default{
  async login(context, payload){
    return context.dispatch('auth',{
      ...payload,
      mode: 'login'
    });
  },
  async signup(context, payload){
    return context.dispatch('auth',{
      ...payload,
      mode: 'signup'
    });
  },
  async auth(context,payload){
    const mode = payload.mode;
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC-3FdBy3LHrLUkTu1dnE406DL7AMQD3RU';
    if(mode === 'signup'){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC-3FdBy3LHrLUkTu1dnE406DL7AMQD3RU'
    }
    const response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
    });

    const reponseData = await response.json();
    
    if(!response.ok){
      const error = new Error(response.message || 'Faild to authenticate. Check your login data.');
      throw error;
    }

    const expiresIn = +reponseData.expiresIn * 1000;
    //const expiresIn = 5000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', reponseData.idToken);
    localStorage.setItem('userId', reponseData.localId);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(function(){
      context.dispatch('autoLogout')
    },expiresIn)

    context.commit('setUser',{
      token: reponseData.idToken,
      userId: reponseData.localId,
      //tokenExpiration: expirationDate
    })
  },
  tryLogin(context){
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    const expiresIn = +tokenExpiration - new Date().getTime()
    
    if(expiresIn < 0){
      return;
    }

    timer = setTimeout(function(){
      context.dispatch('autoLogout')
    },expiresIn)

    if(token && userId){
      context.commit('setUser',{
        token: token,
        userId: userId,
        tokenExpiration: null
      })
    }
  },
  logout(context){

    localStorage.removeItem('token');
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenExpiration')

    clearTimeout(timer)

    context.commit('setUser',{
      token: null,
      userId: null,
      //tokenExpiration: null
    })
  },
  autoLogout(context){
    context.dispatch('logout')
    context.commit('setAutoLogout')
  }
}