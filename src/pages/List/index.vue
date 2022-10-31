<template>
  <van-nav-bar
    fixed
    placeholder="true"
    :title="getTitle"
    left-arrow
    right-text="全部"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
  <van-search
    shape="round"
    v-model="value"
    @search="handleSearch"
    placeholder="请输入搜索关键词"
  />
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      :immediate-check="false"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <Product :dataList="data" />
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { mapGetters } from "vuex";
import { getPro } from "../../api/productService";
import Product from "../../components/product.vue"; //引入商品列表组件
export default {
  name: "List",
  props: ["id"], // 把动态路由参数id作为属性
  components: {
    Product,
  },
  data() {
    return {
      data: [],
      value: "",
      total: 0, // 数据总数
      loading: false, // 加载状态
      finished: false, // 是否可以触发上拉加载事件
      page: 1, // 当前页码
      refreshing: false, // 下载刷新，ture刷新中，false是刷新完成
    };
  },
  computed: {
    ...mapGetters("global", ["getTypeData"]),
    getTitle() {
      // 获取分类名称
      if (!this.id) {
        return "所有商品";
      }
      for (let i = 0; i < this.getTypeData.length; i++) {
        if (this.getTypeData[i].id === Number(this.id)) {
          return this.getTypeData[i].title;
        }
      }
    },
  },
  mounted() {
    this.handleGetPro(this.id);
  },
  watch: {
    $route(route) {
      // 监听路由变化，route是路由对象
      if (route.name === "list") {
        // 判断路由是在list页面才执行操作
        this.page = 1; //  当切换到全部商品，需要重置page和finished，不然上拉加载有问题。
        this.finished = false;
        this.handleGetPro("");
      }
    },
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1); // 返回上一级路由
    },
    handleGetPro(typeid) {
      // 获取商品
      getPro(
        {
          page: this.page,
          orderbytype: "id",
          typeid,
          key: this.value,
        },
        (res) => {
          this.data = res.data[0].data;
          this.total = res.data[1].data[0].count; // 获取数据总数
          this.refreshing = false; // 请求完成修改下拉刷新的状态为false
        }
      );
    },
    handleSearch() {
      // 搜索商品
      this.page = 1; //  当切换到全部商品，需要重置page和finished，不然上拉加载有问题。
      this.finished = false;
      this.handleGetPro(this.id);
    },
    onClickRight() {
      // 显示全部商品
      this.$router.replace("/list"); // 通过路由，不传递id，则是显示所有商品。
      // 在当页面，跳转当前页面的动态路由地址，页面不会重新渲染。需要用watch监听路由变化
      // replace() 是替换当前路由历史记录。
    },
    onLoad() {
      // 加载事件
      let pageAll = Math.ceil(this.total / 10); // 计算总共的页码
      console.log(this.total);
      if (this.page < pageAll) {
        this.page++;
        this.loading = true;
        getPro(
          {
            page: this.page,
            orderbytype: "id",
            typeid: this.id,
            key: this.value,
          },
          (res) => {
            // 加载数据需在原来数据的后面追加加载的数据
            this.data = [...this.data, ...res.data[0].data];
            this.loading = false; // 取消加载动画
          }
        );
      } else {
        this.finished = true; // 没有分页数据，则不要触发onload事件。
      }
    },
    onRefresh() {
      // 下拉刷新
      this.refreshing = true;
      this.page = 1;
      this.handleGetPro(this.id);
    },
  },
};
</script>

<style>
</style>