import { createStore } from "vuex";
import { io } from "socket.io-client";

const store = createStore({
  state: {
    logged: false,
    user: {
      login: "",
      email: "",
      id: "",
    },
    socket: null,
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
    initializeSocket({ commit }) {
      const URL =
        process.env.NODE_ENV === "production"
          ? undefined
          : "http://localhost:3069";
      const socket = io(URL, {
        // autoConnect: false,
        withCredentials: true,
      });
      commit("SET_SOCKET", socket);
    },
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_ISLOGGED(state, payload) {
      state.logged = payload;
    },
    SET_SOCKET(state, payload) {
      state.socket = payload;
    },
  },
});

export default store;
