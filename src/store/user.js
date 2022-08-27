import { updateProfile } from "../api/userServer"

export default {
  namespaced: true,
  state: {
    profile: localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : {}, // 用户信息
  },
  getters: {
    getProfile(state) {
      return state.profile;
    },
    cartNum(state) { // 购物车商品数
      if (state.profile.shoppingcart) {
        return JSON.parse(state.profile.shoppingcart).length;
      }
      return 0;
    }
  },
  mutations: {
    setProfile(state, paylod) { // 修改用户信息数据
      localStorage.setItem("profile", JSON.stringify(paylod.data));// 把用户数据存入localStorage缓存
      state.profile = paylod.data
    },
  },
  actions: {
    setProfileAction(context, paylod) {
      console.log(paylod)
      context.commit({
        ...paylod,
        type: "setProfile"
      })
    },

    setProfileCartAction(context, paylod) { // 更新购物车数据
      console.log(paylod)
      updateProfile({
        filedname: "shoppingcart",
        filedvalue: JSON.stringify(paylod.cartData)
      }, () => {
        context.commit({
          data: { ...paylod.profile, shoppingcart: JSON.stringify(paylod.cartData) },
          type: "setProfile"
        })
      })
    }
  }
}