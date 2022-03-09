import router, { resetRouter } from '@/router'
import * as api from '../../api/api'
import Vue from 'vue'

const state = {
  searchKeyword: '',
  formName: '',
  cateId: '',
  path404: '',
}

const mutations = {
  SET_searchKeyword: (state, searchKeyword) => {
    state.searchKeyword = searchKeyword
  },
  SET_formName: (state, formName) => {
    state.formName = formName
  },
  SET_cateId: (state, cateId) => {
    state.cateId = cateId
  },
  SET_PATH: (state, data) => {
    state.path404 = data
  },
}

const actions = {
  // user login
  SET_searchKeyword({ commit }, searchKeyword) {
    commit('SET_searchKeyword', searchKeyword)
  },
  SET_formName({ commit }, formName) {
    commit('SET_formName', formName)
  },
  SET_cateId({ commit }, cateId) {
    commit('SET_cateId', cateId)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
