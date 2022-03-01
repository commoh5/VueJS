export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {      
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas
    };
    const token = context.rootGetters.token
    const reponse = await fetch(`https://vue-http-327c5-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=`+token,{
      method:'PUT',
      body: JSON.stringify(coachData)
    });
    //const reponseData = await reponse.json();
    if(!reponse.ok){
      //error
    }

    context.commit('registerCoach',{
      ...coachData,
      id: userId
    });
  },
  //GET
  async loadCoaches(context,payload){
    if(!payload.forceRefresh && !context.getters.shouldUpdate){
      return;
    }
    const reponse = await fetch(`https://vue-http-327c5-default-rtdb.firebaseio.com/coaches/.json`);

    const reponseData = await reponse.json();

    if(!reponse.ok){
      const error = new Error(reponseData.message || 'Failed to fetch')
      throw error;
    }

    const coaches = [];

    for(const key in reponseData){
      const coach = {
      id: key,
      firstName: reponseData[key].firstName,
      lastName: reponseData[key].lastName,
      description: reponseData[key].description,
      hourlyRate: reponseData[key].hourlyRate,
      areas: reponseData[key].areas
      };
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches)
    context.commit('setFetchTimestamp')
  }
};