import { createStore } from "vuex";

const store = createStore({
  state: {
    logged: false,
    user: {
      login: "",
      email: "",
      id: "",
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    setUser({ commit }, payload) {
      commit("SET_USER", payload);
    },
    setIsLogged({ commit }, payload) {
      commit("SET_ISLOGGED", payload);
    },
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_ISLOGGED(state, payload) {
      state.logged = payload;
    },
  },
});

export default store;
