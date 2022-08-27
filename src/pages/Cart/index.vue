<template>
  <!-- 若地址展示，则购物车卡片不展示 -->
  <div v-show="!showAddress">
    <van-nav-bar :title="`购物车(${cartNum})`" :left-arrow="showBack === 'detail'" @click-left="$router.go(-1)" fixed
      placeholder />

    <!-- 复选框 -->
    <van-checkbox-group v-model="checked" ref="checkboxGroup" @change="handleChange">
      <dl class="cart-container" v-for="(item, index) in cartData" :key="item.id + index">
        <dt>
          <van-checkbox :name="item.id + '-' + item.color + '-' + item.size"></van-checkbox>
        </dt>
        <dd>
          <!-- 商品卡片 -->
          <van-card :num="item.num" :price="item.price" :title="item.title"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg">
            <template #tags>
              <van-tag v-if="item.color" plain type="danger">颜色:{{ item.color }}</van-tag>
              <van-tag v-if="item.size" plain type="danger">尺寸{{ item.size }}</van-tag>
            </template>
            <template #footer>
              <van-button size="mini" @click="handleDec(index)">
                <van-icon name="minus" />
              </van-button>
              <van-button size="mini" @click="handleAdd(index)">
                <van-icon name="plus" />
              </van-button>
            </template>
          </van-card>
        </dd>
      </dl>
    </van-checkbox-group>

    <van-submit-bar class="cart-submit-bar" :price="totalPrice" button-text="提交订单" @submit="onSubmit">
      <van-checkbox @click="handleCheckAll" v-model="checkAll">全选</van-checkbox>
      <van-button @click="handleDel" size="mini" color="linear-gradient(to right, #ff6034, #ee0a24)"
        style="margin-left:5px;">删除</van-button>
      <template #tip>
        您还未选择收货地址！ <van-button size="mini" type="default" @click="showAddress = true">选择地址</van-button>
      </template>
    </van-submit-bar>

    <Recommend />

    <div class="cart-submit-placeholder"></div>
  </div>

  <myAddress v-show="showAddress" />

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Recommend from "../../components/recommend.vue"
import Address from "../../components/address.vue" // 引入地址组件
export default {
  name: 'Cart',
  components: {
    Recommend,
    myAddress: Address,
  },
  data() {
    return {
      checked: [],
      checkAll: false,
      showBack: this.$route.query.id, // 获取路径查询参数(?号后面的值)id的值
      showAddress: false, // 是否显示地址组件
    }
  },

  mounted() {
    console.log(this.$route);
  },

  computed: {
    ...mapGetters("user", ["cartNum", "getProfile"]),
    // 购物车数据
    cartData() {
      if (this.getProfile.shoppingcart) {
        return JSON.parse(this.getProfile.shoppingcart);
      }
      return []
    },

    // 购物车商品总价
    totalPrice() {
      let count = 0
      this.cartData.forEach(item => {
        console.log(this)
        if (this.checked.includes(item.id + '-' + item.color + '-' + item.size)) {
          console.log(this.checked)
          count += item.price * item.num
        }
      })
      return count * 100
    }
  },

  methods: {
    ...mapActions('user', ['setProfileCartAction']),
    handleChange() {  // 商品checkbox选择
      // 每一次单选都要判断全选的状态是否正确。
      if (this.checked.length > 0 && this.checked.length === this.cartNum) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },

    // 点击全选按钮效果
    handleCheckAll(value) {
      this.$refs.checkboxGroup.toggleAll(value);
    },

    // 删除购物车商品
    handleDel() {
      if (this.cartNum === 0) return;
      let cartData = this.cartData;
      for (let i = 0; i < cartData.length; i++) {
        let item = cartData[i];
        if (this.checked.includes(item.id + "-" + item.color + "-" + item.size)) {
          cartData.splice(i, 1);
          i--;
        }
      }

      // 删除以后需要把数据更新到后端和全局状态
      this.setProfileCartAction({
        profile: this.getProfile,
        cartData
      })
    },

    // 商品数量增加
    handleAdd(index) {
      let cartData = this.cartData;
      cartData[index].num++;
      this.setProfileCartAction({
        profile: this.getProfile,
        cartData
      })
    },

    // 商品数量减少
    handleDec(index) {
      let cartData = this.cartData;
      if (cartData[index].num === 1) return;
      cartData[index].num--;
      this.setProfileCartAction({
        profile: this.getProfile,
        cartData
      })
    },


  }
}
</script>

<style lang="scss" scoped>
.cart-submit-placeholder {
  height: 90px;
}

.cart-submit-bar {
  bottom: 50px !important;
}

.cart-container {
  display: flex;
  width: 100%;
  background-color: #fff;

  .van-card {
    background-color: #fff;
  }

  &>dt {
    display: flex;
    width: 0.67rem;
    justify-content: center;
  }

  &>dd {
    flex: 1;
    margin: 0;
  }
}
</style>