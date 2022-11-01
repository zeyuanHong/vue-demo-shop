<template>
  <van-nav-bar
    title="收货地址"
    left-arrow
    @click-left="hideAddress('cart')"
    fixed
    placeholder
  />
  <van-address-list
    v-model="chosenAddressId"
    default-tag-text="默认"
    :list="address"
    @add="onAdd"
    @edit="onEdit"
    @select="onSelect"
  />
  <van-popup v-model:show="show">
    <van-address-edit
      :address-info="initInfo"
      :area-list="areaList"
      show-postal
      :show-delete="isDelete"
      show-set-default
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </van-popup>
</template>

<script>
import { areaList } from "@vant/area-data";
import { v4 as uuidv4 } from "uuid";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Address",
  props: ["handleAddress", "hideAddress"],
  data() {
    return {
      areaList, // 全国省市区数据
      chosenAddressId: "",
      show: false, // 显示地址编辑弹窗
      isDelete: false, // 是否显示删除按钮
      initInfo: {}, // 地址信息初始值
    };
  },

  mounted() {
    // 第一次进入购物车收货地址应该是显示默认收货地址
    for (let i = 0; i < this.address.length; i++) {
      if (this.address[i].isDefault) {
        // 找到默认地址并传递到父组件
        this.handleAddress(this.address[i]);
        this.chosenAddressId = this.address[i].id;
        break;
      }
    }
  },

  computed: {
    ...mapGetters("user", ["address"]),
  },

  methods: {
    ...mapActions("user", ["setProfileAddressAction"]),

    onAdd() {
      // 显示添加用户地址
      this.show = true;
      this.isDelete = false;
      this.initInfo = {}; // 添加添加初始数据为空对象
    },
    onEdit(content) {
      // 弹窗编辑用户地址，content是点击当前的地址信息。
      this.initInfo = content; // 点击编辑，把点击的地址数据填充到填写框
      this.show = true;
      this.isDelete = true;
    },

    onSave(content) {
      // 点击保存地址，content是地址数据
      // 保存的时候需要根据initInfo数据是否有值，判断是新增地址还是修改地址。
      let data = {
        ...content,
        address: `${content.province} ${content.city} ${content.county} ${content.addressDetail}`,
      };
      if (this.initInfo.id) {
        // 修改数据
        for (let i = 0; i < this.address.length; i++) {
          if (this.address[i].id === this.initInfo.id) {
            this.address[i] = { ...this.address[i], ...data };
            break;
          }
        }
      } else {
        // 新增数据
        this.address.push({
          ...data,
          id: uuidv4(), // 生成唯一id
        });
      }
      // 默认收货地址只能设置一个，如果新加或者修改的地址设置了默认地址，需求吧其他默认地址给隐藏.
      if (content.isDefault) {
        // 设置了默认地址
        this.address.forEach(function (item) {
          if (item.id !== content.id) {
            item.isDefault = false;
          }
        });
      }
      // 更新全局状态和后端数据库的地址数据。
      this.setProfileAddressAction({ data: this.address }).then(() => {
        this.show = false; // 应该是后端保存成功才隐藏弹窗
      });
    },

    onDelete() {
      // 删除地址
      for (let i = 0; i < this.address.length; i++) {
        if (this.address[i].id === this.initInfo.id) {
          this.address.splice(i, 1);
          break;
        }
      }
      this.setProfileAddressAction({ data: this.address }).then(() => {
        this.show = false; // 应该是后端保存成功才隐藏弹窗
      });
    },

    onSelect(content) {
      this.handleAddress(content); // 把当前选中的地址传到父组件的handleAddress方法。
    },
  },
};
</script>

<style lang="scss" scoped>
// 给顶部收货地址设置固定高度
.van-nav-bar__placeholder {
  height: 46px;
}
</style>