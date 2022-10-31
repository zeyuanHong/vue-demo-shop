<template>
  <div class="login register-img" :class="{ 'login-img': isLogin }">
    <div class="logo">
      <img src="../../assets/images/logo_03.png" />
      <h1>购物APP</h1>
    </div>
    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="email"
          name="邮箱"
          label=""
          placeholder="邮箱"
          :rules="[
            { required: true, message: '请填写邮箱' },
            { pattern: /.+@.+\..+/, message: '请填写正确的邮箱' },
          ]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label=""
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            { pattern: /\w{4,8}/, message: '密码是4-8位的数字,字母,下划线' },
          ]"
        />
        <van-field
          v-if="!isLogin"
          v-model="confirmPassword"
          type="password"
          name="确认密码"
          label=""
          placeholder="确认密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { pattern: /\w{4,8}/, message: '密码是4-8位的数字,字母,下划线' },
          ]"
        />
      </van-cell-group>
      <div style="margin: 16px; padding: 0 16px">
        <van-button round block type="primary" native-type="submit">
          {{ isLogin ? "登录" : "注册" }}
        </van-button>
      </div>
    </van-form>
    <button class="button" @click="isLogin = !isLogin">
      {{ isLogin ? "注册账号" : "已经有账户" }}
    </button>
  </div>
</template>

<script>
import { Notify } from "vant";
import { login, register } from "../../api/userServer";
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      isLogin: true, // 控制显示登录还是注册
    };
  },
  methods: {
    onSubmit() {
      if (this.isLogin) {
        // 登录状态则调用登录接口
        login(
          {
            email: this.email,
            password: this.password,
          },
          (res) => {
            if (!res.token) {
              Notify("用户名或密码错误");
              return;
            }
            // 登录成功需要跳转到个人中心页面，并且记录token
            localStorage.setItem("token", res.token);
            this.$router.push("/my");
          }
        );
      } else {
        if (this.password !== this.confirmPassword) {
          Notify("两次密码输入不一致");
          return;
        }
        register(
          {
            email: this.email,
            password: this.password,
            repassword: this.confirmPassword,
          },
          (res) => {
            // 注册成功提醒用户并切换到登录状态
            Notify({ type: "success", message: "注册成功,请登录。" });
            this.isLogin = true;
          }
        );
      }
    },
  },
};
</script>


<style lang="scss">
.login-form {
  margin: 2rem 0.52rem;

  .van-cell-group,
  .van-cell {
    background-color: transparent;
  }

  input {
    height: 0.98rem;
    border: 1px solid #a8a5a5;
    padding: 0 0.15rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .van-cell:after {
    display: none;
  }

  button {
    background-color: #fff;
    border-radius: 0.05rem;
    color: #393939;
    font-size: 0.3rem;
    border-color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.login {
  padding-top: 1px;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  text-align: center;
}

.logo {
  margin-top: 25%;
  text-align: center;
  color: #bdbdbd;

  h1 {
    margin-top: 0.3rem;
    font-size: 0.4rem;
  }

  img {
    width: 2.9rem;
  }
}

.register-img {
  background-image: url(../../assets/images/register.png);
}

.login-img {
  background-image: url(../../assets/images/login.png);
}

.button {
  color: #fff;
  background-color: transparent;
  border: none;
  font-size: 0.2rem;
}
</style>