<template>
  <div>
    <div class="form">
      <el-input v-model="studentName" placeholder="输入学生姓名" class="input"></el-input>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <el-table :data="tableData">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column prop="id" label="学生id">
      </el-table-column>
      <el-table-column prop="studentName" label="姓名">
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[10, 50, 100, 200]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {getPage} from "../../api/demo";

  export default {
    name: "demo",
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        studentName: ''
      }
    },
    methods: {
      /**
       * 基本说明： vue有几个生命周期函数了解一下。。。
       * (在 vue对象中注册了$http方法（@see admin-fe/src/common/http.js）发起后台请求支持多种请求 get post....)弃用了
       * 请求路径头路径自己在文件中配置(baseUrl)
       * 可在请求中传入json，或者js对象进行传参 例如：this.$http.get("url",{params:data});
       * 在回调函数中取得请求返回值
       *
       */
      getData() {
        let this_ = this;
        let param = {
          currentPage: this_.currentPage,
          limit: this_.pageSize,
          studentName:this_.studentName
        };
        console.log(param);
        getPage(JSON.stringify(param)).then((result) => {
          this_.tableData = result.data.list;
          this_.total = result.data.totalCount;
        }).catch((error) => {
          console.log(error);
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      search(){
         this.currentPage = 1;
          this.getData();
      }
    },
    mounted() {
      this.getData();
    },
    activated() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>
  .form{
    padding: 20px;
    .input{
      width: 30%;
    }
  }

</style>
