
import getters from './getters';
import mutations from './mutation';
import state from './state';
import actions from './actions';

import Vue from 'vue';
import VueX from 'vuex';

Vue.use(VueX);

export default new VueX.Store({
    modules: {},
    state,
    getters,
    mutations,
    actions
})