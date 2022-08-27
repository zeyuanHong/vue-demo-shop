import { createStore } from "vuex";
import global from "./global";
import user from "./user";
export default createStore({
  modules:{
    global,
    user
  }
})