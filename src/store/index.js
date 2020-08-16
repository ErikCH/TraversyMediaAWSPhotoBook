import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './auth/auth.js';
import { albumInfo } from './albums/albums.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    albumInfo
  }
})
