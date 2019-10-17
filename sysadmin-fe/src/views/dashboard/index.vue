<template>
  <div class="dashboard" :style="{height: topHeight}">
    <div class="welcome">
      <div class="welcome-user">{{welcome}}{{loginUser}}！</div>
      <div class="welcome-cn">欢迎使用组织结构管理平台</div>
      <div class="welcome-en">Welcome to use sysadmin platform</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import adminDashboard from './admin'
  import editorDashboard from './editor'

  export default {
    name: 'Dashboard',
    components: {adminDashboard, editorDashboard},
    data() {
      return {
        //	accountNo:getToken("user").username
        windowHeight: "",
        topHeight: "",
        loginUser: "",
        welcome: ""
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    watch: {
      topHeight(val) {
        this.topHeight = val
        console.log("height:", val)
      }
    },
    created() {
      console.log("当前登录人：", this.loginUser)
      let now = new Date()
      let hour = now.getHours()
      console.log(20 <= hour < 24)
      switch (true) {
        case (20 <= hour  && hour < 24):
          this.welcome = "晚安，"
          break
        case (18 <= hour && hour < 20):
          this.welcome = "晚上好，"
          break
        case (14 <= hour && hour < 18):
          this.welcome = "下午好，"
          break
        case (12 <= hour && hour < 14):
          this.welcome = "中午好，"
          break
        case (10 <= hour && hour < 12):
          this.welcome = "上午好，"
          break
        case (6 <= hour && hour < 10):
          this.welcome = "早上好，"
          break
        case (0 <= hour && hour < 6):
          this.welcome = "凌晨好，"
          break
        default:
          this.welcome = "你好，";
      }
      let username = this.$store.getters.name
      if (username !== null) {
        this.loginUser = username
      } else {
        this.loginUser = this.$store.getters.nowLogin.accountNo
      }
    },
    mounted() {
      this.windowHeight = window.innerHeight
      this.topHeight = (this.windowHeight - 105) + "px"
      window.onresize = () => {
        return (() => {
          this.windowHeight = window.innerHeight;
          this.topHeight = (this.windowHeight - 105) + "px";
        })();
      };
    }

  }
</script>
<style lang="scss" scoped>
  .dashboard {
    width: 100%;
    text-align: center;
    color: #377ac2;
    background: url("~@/assets/dashboard/background.png") no-repeat;
    background-size: 100%;

    .welcome {
      position: relative;
      top: 30%;
      font-size: 20px;
      z-index: 9;
    }

    .welcome-user {
      font-size: 1.8em;
      color: #15244c;
      margin: 20px;
    }

    .welcome-cn {
      font-size: 2em;
      font-weight: bold;
      color: #15244c;
      margin: 10px;
    }

    .welcome-en {
      font-size: .9em;
      color: #15244c;
      margin: 10px;
    }
  }
</style>
