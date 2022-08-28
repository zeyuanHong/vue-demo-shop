<template>
  <!-- 若地址展示，则购物车卡片不展示 -->
  <div v-show="showCom === 'cart'">
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
            :thumb="staticUrl + '/' + item.img">
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

    <!-- 订单提交 -->
    <van-submit-bar class="cart-submit-bar" :price="totalPrice" button-text="提交订单" @submit="onSubmit">
      <van-checkbox @click="handleCheckAll" v-model="checkAll">全选</van-checkbox>
      <van-button @click="handleDel" size="mini" color="linear-gradient(to right, #ff6034, #ee0a24)"
        style="margin-left:5px;">删除</van-button>
      <template #tip>
        {{ selectAddressShow }} <van-button size="mini" type="default" @click="showCom = 'address'">选择地址</van-button>
      </template>
    </van-submit-bar>

    <!-- 商品列表组件 -->
    <Recommend />

    <div class="cart-submit-placeholder"></div>
  </div>

  <div v-show="showCom === 'address'" class="address">
    <!-- 地址组件 -->
    <myAddress :handleAddress="handleAddress" :hideAddress="hideCom" />
  </div>

  <div v-show="showCom === 'order'" class="order">
    <!-- 确认订单组件 -->
    <confirmOrder :address="selectAddress" :hideCom="hideCom" :selectPro="selectPro" :price="totalPrice"
      :checked="checked" />
  </div>
</template>

<script>
import { Notify } from "vant"
import { mapGetters, mapActions } from 'vuex'
import { staticUrl } from "../../api/api"
import Recommend from "../../components/recommend.vue"
import Address from "../../components/address.vue" // 引入地址组件
import ConfirmOrder from "../../components/confirmOrder.vue" // 引入确认订单组件
export default {
  name: 'Cart',
  components: {
    Recommend,
    myAddress: Address,
    confirmOrder: ConfirmOrder
  },
  data() {
    return {
      staticUrl,
      checked: [],
      checkAll: false,
      showCom: 'cart', // 展示组件
      showBack: this.$route.query.id, // 获取路径查询参数(?号后面的值)id的值
      selectAddress: '', //用户选择的地址
    }
  },

  mounted() {
    // console.log(this.$route)
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
        // console.log(this)
        if (this.checked.includes(item.id + '-' + item.color + '-' + item.size)) {
          console.log(this.checked)
          count += item.price * item.num
        }
      })
      return count * 100
    },

    selectAddressShow() { // 计算地址显示内容
      return this.selectAddress ? this.selectAddress.name + "," + this.selectAddress.tel : "您还没有设置收货地址"
    },

    selectPro() { // 计算需要购买的商品数据 需要给确认订单组件传过去
      let data = this.cartData.filter((item) => this.checked.includes(item.id + "-" + item.color + "-" + item.size));
      return data;
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

    onSubmit() { // 提交订单
      if (this.checked.length === 0) {
        Notify("请至少选择一款购买商品");
        return;
      }
      if (!this.selectAddress) {
        Notify("请选择收货地址");
        return;
      }
      this.showCom = 'order'
    },

    hideCom(type) { // 隐藏地址组件
      this.showCom = type
    },
    handleAddress(address) { // 子组件传递选中的地址到该方法
      this.selectAddress = address;
    }


  }
}
</script>

<style lang="scss">
// 地址组件的样式
.address,
.order {
  .van-popup {
    width: 90%;
  }
}

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