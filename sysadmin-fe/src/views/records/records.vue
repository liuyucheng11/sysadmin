<!--
<template/>里写html页面的组件，相当于表现层
-->
<template>
  <!--注意，template中只能有一个div-->
  <div>
  <h2>操作记录</h2>
    <!--这是表格控件-->
    <el-table
      class="result-table"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="id" label="主键"></el-table-column>
      <el-table-column prop="createId" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="modifyId" label="修改人"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
      <el-table-column prop="tableName" label="目标表名"></el-table-column>
      <el-table-column prop="tableId" label="目标主键"></el-table-column>
      <el-table-column prop="modifyField" label="修改字段"></el-table-column>
      <el-table-column prop="modifyBefore" label="修改前值"></el-table-column>
      <el-table-column prop="modifyAfter" label="修改后的值"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <!--这是分页控件-->
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="200">
      </el-pagination>
    </div>
  </div>
</template>
<!--
<script>里写vue的语法语句，是控制层
-->
<script>
    export default {
        name: "records",
        methods: {
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        }
      },
      data() {
        return {
          tableData: [{
            id: 100000,
            createId: 1000111,
            createTime:'2019-08-06 15:41:39',
            modifyId: 1000111,
            modifyTime:'2019-08-06 15:43:48',
            tableName:'员工管理表',
            tableId:1000253,
            modifyField:'密码',
            modifyBefore:'555555',
            modifyAfter:'888888',
            remark:'第一次修改'
          }, {
            id: 100001,
            createId: 1000111,
            createTime:'2019-08-06 15:41:39',
            modifyId: 1000111,
            modifyTime:'2019-08-06 15:43:48',
            tableName:'员工管理表',
            tableId:1000253,
            modifyField:'密码',
            modifyBefore:'555555',
            modifyAfter:'888888',
            remark:'第二次修改'
          }, {
            id: 100002,
            createId: 1000111,
            createTime:'2019-08-06 15:41:39',
            modifyId: 1000111,
            modifyTime:'2019-08-06 15:43:48',
            tableName:'员工管理表',
            tableId:1000253,
            modifyField:'密码',
            modifyBefore:'555555',
            modifyAfter:'888888',
            remark:'第三次修改'
          }, {
            id: 100003,
            createId: 1000111,
            createTime:'2019-08-06 15:41:39',
            modifyId: 1000111,
            modifyTime:'2019-08-06 15:43:48',
            tableName:'员工管理表',
            tableId:1000253,
            modifyField:'密码',
            modifyBefore:'555555',
            modifyAfter:'888888',
            remark:'第四次修改'
          }],
          currentPage: 1,
        }
      }
    }
</script>
<!--
<style/>里写样式,主要是负责<template>内组件的修饰工作
-->
<style scoped>
  .result-table {
    margin-top: 15px;
  }
</style>
