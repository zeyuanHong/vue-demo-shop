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
    },
    cartData(state) { // 购物车商品数据
      if (state.profile.shoppingcart) {
        return JSON.parse(state.profile.shoppingcart);
      }
      return [];
    },
    address(state) {// 返回用户地址数据
      if (state.profile.myaddress) {
        return JSON.parse(state.profile.myaddress);
      }
      return []
    }
  },
  mutations: {
    setProfile(state, paylod) { // 修改用户信息数据
      if (paylod.data?.id) {
        localStorage.setItem("profile", JSON.stringify(paylod.data));// 把用户数据存入localStorage缓存
      }
      state.profile = paylod.data
    },

    setProfileAddress(state, payload) {
      state.profile.myaddress = payload.data
      localStorage.setItem("profile", JSON.stringify(state.profile));// 把用户数据存入localStorage缓存
    }

  },
  actions: {
    setProfileAction(context, paylod) {
      // console.log(paylod)
      context.commit({
        ...paylod,
        type: "setProfile"
      })
    },

    setProfileCartAction(context, paylod) { // 更新购物车数据
      // console.log(paylod)
      updateProfile({
        filedname: "shoppingcart",
        filedvalue: JSON.stringify(paylod.cartData)
      }, () => {
        context.commit({
          data: { ...paylod.profile, shoppingcart: JSON.stringify(paylod.cartData) },
          type: "setProfile"
        })
      })
    },

    setProfileAddressAction(context, paylod) { // 更新用户地址的action
      return new Promise((resolve, reject) => {
        updateProfile({ // 把修改用户地址的数据更新到后端数据库，成功以后再更新到全局state
          filedname: "myaddress",
          filedvalue: JSON.stringify(paylod.data),
        }, () => {
          context.commit({
            data: JSON.stringify(paylod.data),
            type: "setProfileAddress"
          })
          resolve()
        })
      })
    },
    
  }
}