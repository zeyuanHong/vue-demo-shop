<template>
  <!-- 搜索框 -->
  <van-search class="home-search" shape="round" v-model="value" placeholder="请输入搜索关键词" @click="$router.push('/list')" />
  <!-- 轮播图 -->
  <van-swipe class="home-swipe" :autoplay="3000" lazy-render>
    <van-swipe-item v-for="item in getBanner" :key="item.id">
      <img :src="staticUrl + '/' + item.img" />
    </van-swipe-item>
  </van-swipe>
  <!-- 四个跳转图片 -->
  <div class="home-nav-1">
    <router-link to="">
      <img src="../../assets/images/1_09.png" />
      <p>购物车</p>
    </router-link>
    <router-link to="">
      <img src="../../assets/images/1_11.png" />
      <p>优惠卷</p>
    </router-link>
    <router-link to="">
      <img src="../../assets/images/1_03.png" />
      <p>我的订单</p>
    </router-link>
    <router-link to="">
      <img src="../../assets/images/1_06.png" />
      <p>我的收藏</p>
    </router-link>
  </div>
  <!-- 四个分类方形图片 -->
  <div class="home-nav-2">
    <router-link :to="'/list/'+item.id" v-for="(item, index) in recommendType" :key="index">
      <h3>{{ item.title }}</h3>
      <p>{{ item.subtitle || "&nbsp;" }}</p>
      <img :src="staticUrl + '/' + item.img" />
    </router-link>
  </div>
  <!-- 商品列表 -->
  <div class="home-pro">
    <h3 class="title">
      <span v-show="showType === 'new'" class="iconfont icon-left-circle" @click="getHot"></span>
      {{ showType === 'hot' ? '超值热卖' : '最新上架' }} <span class="iconfont icon-round_right" v-show="showType === 'hot'"
        @click="getNew"></span>
      <span class="tag">{{ showType === "hot" ? 1 : 2 }}/2</span>
    </h3>
    <Product :dataList="showData" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { getAllProType, getBanner } from "../../api/otherServer"
import { getPro } from "../../api/productService"
import { staticUrl } from "../../api/api"
import Product from "../../components/product.vue";//引入商品列表组件
export default {
  name: 'Home',
  components: {
    Product
  },
  data() {
    return {
      value: '',
      typeData: [],//所有分类
      proData: { hot: [], new: [] }, //  商品数据，把对应商品的数据放到属性，如果属性有数据就不需要从后端请求数据。
      showType: 'hot',//显示的商品类型
      staticUrl // import引入的变量template需要用，则要作为数据
    }
  },
  computed: {
    ...mapGetters("global", ["getBanner","recommendType"]), // 把globa模块的getBanner 数据作映射为计算属性。

    // 计算显示那个分类的数据
    showData() {
      return this.proData[this.showType];
    }
  },

  mounted() {
    this.init()
    this.getHot()
    console.log(this.recommendType.length)
  },

  methods: {
    ...mapActions("global", ["setBannerAction", "setTypeAction"]),

    init() {  //请求数据的方法
      if (this.getBanner.length === 0) {
        getBanner((res) => {
          this.setBannerAction({
            data: res.data[0]
          })
        })
      }

      // 获取商品分类数据
      if (this.recommendType.length === 0) {
        getAllProType((res) => {
          // console.log(res)
          this.setTypeAction({data: res.data[0].data})
        })
      }
    },

    getHot() { // 获取热卖商品数据
      if (this.proData.hot.length > 0) {
        this.showType = "hot"
      } else {
        getPro({ page: 1, orderbytype: "sales" }, (res) => {
          this.proData.hot = res.data[0].data;
          this.showType = "hot";
        });
      }
    },

    getNew() { // 获取最新上架商品数据
      if (this.proData.new.length > 0) {
        this.showType = "new";
      } else {
        getPro({ page: 1, orderbytype: "id" }, (res) => {
          this.proData.new = res.data[0].data;
          this.showType = "new";
        });
      }
    },


  },


}
</script>

<style src="./index.scss">
</style>