import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'

export default new Vuex.Store({
  state: {
    user: null,
    users: [],
    campaign: null,
    campaigns: [],
    pcs: [],
    pc: null
  },
  getters: {
    isLoggedIn: state => !!state.user,
    getUserId: (state) => { return state.user.id}
  },
  mutations: 
    {
    setUsers(state, users) {
      state.users = users;
    },
    setUser(state, user) {
      state.user = user;
    },
    setCampaign(state, campaign){
      state.campaign = campaign;
    },
    setCampaigns(state, campaigns){
      state.campaigns = campaigns;
    },
    setPcs(state, pcs){
      state.pcs = pcs;
    },
    setPc(state, pc) {
      state.pc = pc;
    }
  },
  actions: {
    async getUsers({ commit }) {
      const response = await axios.get('/users');
      commit('setUsers', response.data);
    },
    async register({ commit }, payload) {
      const response = await axios.post('/users/register', payload);
      commit('setUser', response.data);
    },
    login({ commit }, payload) {
      return axios.post('/users/login', payload)
        .then(response => commit('setUser', response.data));
    },
    logout({ commit }) {
      return axios.post('/users/logout')
        .then(() => commit('setUser', null));
    },
    loadcurrentuser({ commit }) {
      axios.get('/users/current')
        .then(response => commit('setUser', response.data));
    },
    loadCampaign({ commit }, payload) {
      axios.get(`/campaigns/${payload}`)
        .then(response => commit('setCampaign', response.data));
    },
    loadPc({ commit }, payload) {
      axios.get(`/pcs/${payload}`)
        .then(response => commit('setPc', response.data));
    },
    async getCampaigns({ commit }, payload) {
      const response = await axios.get('/campaigns', payload);
      commit('setCampaigns', response.data);
    },
    async AddCampaign({ commit }, payload){
      const response = await axios.post('/addCampaign', payload)
      commit('setCampaign', response.data);
    },
    async AddPc({ commit }, payload){
      const response = await axios.post('/addPc', payload)
      commit('setPc', response.data);
    },
    async getPcs({ commit }, payload) {
      const response = await axios.get('/pcs', payload);
      commit('setPcs', response.data);
    }
  }
})
