<template>
  <div class="history">
    <el-row class="row-title">
      登录账号：{{accountNo}}
      <el-button type="primary" style="margin-left: 70%;margin-bottom: 10px" @click="returnList">返回列表</el-button>
    </el-row>
    <div class="search-result">
      <div class="result-table">
        <el-table :data="historyList">
          <el-table-column prop="staffNumber" label="员工编号"></el-table-column>
          <el-table-column prop="staffName" label="员工姓名"></el-table-column>
          <el-table-column prop="dataLimit" label="数据权限类型">
            <template slot-scope="scope">
              {{getDataLimit(scope.row.dataLimit)}}
            </template>
          </el-table-column>
          <el-table-column prop="modifyType" label="操作类型">
            <template slot-scope="scope">
              {{getModifyType(scope.row.modifyType)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态">
            <template slot-scope="scope">
              {{getStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="操作时间">
            <template slot-scope="scope">
              {{scope.row.modifyTime}}
            </template>
          </el-table-column>
          <el-table-column prop="modifyName" label="操作人"></el-table-column>
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
    </div>
  </div>
</template>

<script>

  import {getHistoryPage} from "../../../api/accountManage";
  import accountEnum from "./accountEnum";

    export default {
      name: "history",
      data() {
        return {
          accountNo: null,
          currentPage: 1,
          pageSize: 10,
          total: 0,
          accountId: '',
          historyList: [
          ]
        }
      },
      computed: {
        getDataLimit() {
          return function(param) {
            return accountEnum.dataLimit.getLabelByValue(param)
          }
        },
        getStatus() {
          return function (param) {
            return accountEnum.status.getLabelByValue(param)
          }
        },
        getModifyType() {
          return function (param) {
            return accountEnum.modifyType.getLabelByValue(param)
          }
        }
      },
      methods: {
        initForm() {
          let this_ = this;
          this_.historyList = null;
        },
        getData() {
          let this_ = this;
          let param = {
            currentPage: this_.currentPage,
            limit: this_.pageSize,
            accountId: this_.accountId
          };
          getHistoryPage(JSON.stringify(param)).then((result) => {
            // this_.accountNo = result.data.accountNo;
            this_.historyList = result.data.resultPage.list;
            this_.total = result.data.resultPage.totalCount;
          }).catch((error) => {
            console.log(error);
          });
        },
        //分页处理等待后台适配
        handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this.getData();
        },
        //同上
        handleCurrentChange(val) {
          this.currentPage = val;
          this.getData();
        },
        returnList() {
          // 关闭面包屑后返回
          this.$store.dispatch('tagsView/delVisitedView', this.$route);
          this.$router.go(-1);
          this.$router.push('/accountManage/list');
        },
      },
      created() {
        this.accountId = this.$route.params.accountId;
        this.accountNo = this.$route.params.accountNo;
        this.getData();
      },
      activated() {
        this.accountId = this.$route.params.accountId;
        this.accountNo = this.$route.params.accountNo;
        this.getData();
      }
    }
</script>

<style lang="scss" scoped>
  .history {
    padding: 20px;

    .row-title {
      border-bottom: 1px solid #ddd;
    }
  }
  .search-result {
    margin-top: 10px;
  }
</style>
