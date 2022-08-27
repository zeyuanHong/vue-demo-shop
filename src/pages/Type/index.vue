<template>
  <van-nav-bar title="商品分类" />
  <van-search shape="round" placeholder="请输入搜索关键词" @click="$router.push('list')"/>
  <dl class="dl">
    <dt>
      <van-sidebar v-model="active">
        <van-sidebar-item :key="item.id" v-for="item in getTypeDataTitle" :title="item.title"
          @click="changeTitleId(item.id)" />
      </van-sidebar>
    </dt>
    <dd>
      <div class="content">
        <router-link :to="'/list/' + item.id" :key="item.id" v-for="item in secondType">
          <img :src="staticUrl + '/' + item.img" />
          <p>{{ item.title }}</p>
        </router-link>
      </div>
    </dd>
  </dl>
</template>

<script>
import { mapGetters } from 'vuex';
import { staticUrl } from "../../api/api";
export default {
  name: 'Type',
  data() {
    return {
      staticUrl,
      active: "",
      titleId: "", // 当前主分类的id
    }
  },
  computed: {
    // 从全局state获取typeData分类数据
    ...mapGetters("global", ["getTypeData", "getTypeDataTitle"]),
    secondType() {
      // 返回一级分类下面的所有二级分类
      return this.getTypeData.filter((item) => item.fatherid.includes(this.titleId) && item.typelevel === 1)
    }
  },
  methods: {
    changeTitleId(id) { // 点击主分类，把主分类id赋值给titleId数据
      this.titleId = id;
    }
  }
}
</script>

<style lang="scss" scoped>
.dl {
  display: flex;
  width: 100%;
  margin: 0;
  border-top: 1px solid #ebebeb;

  &>dt {
    width: 80px;
  }

  &>dd {
    flex: 1;
    margin: 0;
    background-color: #fff;
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  text-align: center;

  &>a {
    flex: 0 0 33.3%;
    margin: .2rem 0;

    &>img {
      width: 60%;
    }

    &>p {
      font-size: .26rem;
      color: #797979;
    }
  }
}
</style>