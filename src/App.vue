<template>
  <router-view></router-view>
  <!-- 开启安全区域 -->
  <van-tabbar route :placeholder="true" fixed v-model="active" active-color="#fc5051">
    <van-tabbar-item to="/">
      <template #icon="props">
        <span class="iconfont icon-shouye font-28"></span>
      </template>
      首页
    </van-tabbar-item>
    <van-tabbar-item to="/type">
      <template #icon="props">
        <span class="iconfont icon-fenlei font-28"></span>
      </template>
      分类
    </van-tabbar-item>
    <van-tabbar-item to="/cart" :badge="cartNum">
      <template #icon="props">
        <span class="iconfont icon-gouwuche font-28"></span>
      </template>
      购物车
    </van-tabbar-item>
    <van-tabbar-item to="/my">
      <template #icon="props">
        <span class="iconfont icon-wode font-28"></span>
      </template>
      我的
    </van-tabbar-item>
  </van-tabbar>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      active: 'cart',
      showTabBar: false,
    }
  },

  computed: {
    ...mapGetters("user", ["cartNum"]) // 获取购物车商品数量
  },
  watch: {
    $route(route) { // 监听路由变化，控制tabbar的显示隐藏，以及激活状态
      if (["home", "type", "cart", "my"].includes(route.name)) {
        this.showTabBar = true;
      } else {
        this.showTabBar = false;
      }
    }
  }
}
</script>

<style scoped>
</style>