const namespaced = true

const state = {
    savedProduct: null
}

const getters = {
    getSavedProduct: (state) => state.savedProduct
}

const actions = {}

const mutations = {
    setSavedProduct (state, payload) {
        state.savedProduct = payload
    }
}

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}
