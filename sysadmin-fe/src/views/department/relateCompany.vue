<template>
  <el-table :data="relateCompanyList" border @selection-change="selectCompany">
    <el-table-column type="selection" v-if="openSelect" width="50px"></el-table-column>
    <el-table-column prop="id" label="编号" width="100px"></el-table-column>
    <el-table-column prop="companyName" label="公司名称" width="250px"></el-table-column>
    <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" width="200px"></el-table-column>
    <el-table-column prop="companyType" label="类型" width="150px">
      <template slot-scope="scope">
        {{getCompanyType(scope.row.companyType)}}
      </template>
    </el-table-column>
    <el-table-column prop="corporateNature" label="公司性质" width="150px">
      <template slot-scope="scope">
        {{getCorporateNature(scope.row.corporateNature)}}
      </template>
    </el-table-column>
    <el-table-column prop="headOfficeFlag" label="总公司标志" width="100px">
      <template slot-scope="scope">
        {{getHeadOfficeFlag(scope.row.headOfficeFlag)}}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" width="100px">
      <template slot-scope="scope">
        {{getStatus(scope.row.status)}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import comEnum from "../companyManage/companyEnum";

  export default {
    name: "relateCompany",
    props: {
      relateCompanyList: {
        type: Array,
        default:[]
      },
      openSelect: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        list: []
      }
    },
    computed: {
      getCompanyType() {
        return function (param) {
          return comEnum.companyType.getLabelByValue(param)
        }
      },
      getCorporateNature() {
        return function (param) {
          return comEnum.corporateNature.getLabelByValue(param)
        }
      },
      getHeadOfficeFlag() {
        return function (param) {
          return comEnum.headOfficeFlag.getLabelByValue(param)
        }
      },
      getStatus() {
        return function (param) {
          return comEnum.status.getLabelByValue(param)
        }
      }
    },
    methods: {
      selectCompany(val) {
        this.$emit('select',val)
      }
    }
  }
</script>

<style lang="scss">
  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }
</style>
