<template>
  <div style="margin-bottom: 100px">
    <div class="module">
      <el-card>
        <el-row class="row-title">
          <h2>部门管理</h2>
        </el-row>
        <el-row>
          <el-button type="primary" icon="el-icon-plus" @click="createDepartment()" v-permission="['/department/add']" :disabled="canCreate">新建</el-button>
          <el-button type="warning" icon="el-icon-edit" @click="updateDepartment()" v-permission="['/department/update']" :disabled="canCreate">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteDepartment()" v-permission="['/department/delete']" :disabled="selected">删除</el-button>
          <el-button type="primary" icon="el-icon-search" @click="updateParentDepartment()" v-permission="['/department/updateParent']" :disabled="selected">
            修改上级部门
          </el-button>
          <el-button type="success" @click="relateCompany()" v-permission="['/department/relateCompany']" :disabled="canCreate">
            <svg-icon icon-class="department" style="margin-right: 5px"/>
            关联公司
          </el-button>
        </el-row>
        <el-row>
          <department-tree :clear-choose="clearChoose" :refresh="refresh" @clear="clearDepartment" @selectId="changeSelectId" @refresh="listRefresh"></department-tree>
        </el-row>
        <el-dialog
          title="选择上级部门"
          :visible.sync="dialogVisible">
          <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="commitParent()">提交</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="cancelUpdateParent()">取消</el-button>
          </el-row>
          <department-tree :select="selectId" @selectId="changeParentId"></department-tree>
        </el-dialog>
        <el-dialog
          title="关联公司"
          :visible.sync="companyVisible" width="1151px">
          <el-row>
            <el-col :span="12">
              <el-button type="primary" @click="chooseCompanyVisible()">添加</el-button>
              <el-button type="primary" @click="deleteRelateCompany()" :disabled="this.selectRelateCompany.length === 0">移除</el-button>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="primary" @click="commitRelateCompany()">保存</el-button>
              <el-button type="primary" @click="cancelCommitRelateCompany()">取消</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <relate-company :relate-company-list="relateCompanyList" :open-select="true" @select="selectCompany"></relate-company>
          </el-row>
          <el-dialog
            title="选择关联公司"
            :visible.sync="chooseCompanyDialogVisible"
            width="80%"
            :modal="false"
            fullscreen>
            <choose-company :select-list="relateCompanyList" :refresh="chooseCompanyDialogVisible" :department-id="selectId" @close="closeChooseCompany" @list="chooseCompany"></choose-company>
          </el-dialog>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {Message} from 'element-ui'
  import {
    deleteDepartment,
    insertRelateCompany,
    queryRelateCompanyList,
    updateDepartment,
    updateParentDepartment
  } from "../../api/department";
  import DepartmentTree from "./departmentTree";
  import ChooseCompany from "./chooseCompany";
  import comEnum from "../companyManage/companyEnum";
  import RelateCompany from "./relateCompany";

  export default {
    name: 'Index',
    components: {RelateCompany, ChooseCompany, DepartmentTree},
    data() {
      return {
        selectId: null,
        selected: true,
        changeParent: null,
        dialogVisible: false,
        refresh: false,
        canCreate: true,
        companyVisible: false,
        chooseCompanyDialogVisible: false,
        relateCompanyList: [],
        selectRelateCompany: [],
        clearChoose: false
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
    watch: {
      selectId() {
        this.selected = null === this.selectId || this.selectId === 1
        this.canCreate = null === this.selectId
      },
      'companyVisible' :{
        handler: function () {
          if (!this.companyVisible) {
            this.relateCompanyList = []
          }
        }
      }
    },
    methods: {
      createDepartment() {
        let details = this.$router.resolve({
          name: "departmentCreate",
          query: {
            departmentId: this.selectId,
          }
        });
        window.open(details.href, '_blank')
      },
      updateDepartment() {
        let details = this.$router.resolve({
          name: "departmentUpdate",
          params: {
            id: this.selectId,
          }
        });
        window.open(details.href, '_blank')
      },
      deleteDepartment() {
        this.$confirm('即将删除所选部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDepartment({id: this.selectId}).then((res) => {
            if (res.data) {
              Message({
                message: '删除成功',
                type: 'success'
              })
              this.selected = true
              this.selectId = null
              this.refresh = true
            } else {
              Message({
                message: '删除失败，请检查部门状态',
                type: 'error'
              })
            }
          })
        })
      },
      updateParentDepartment() {
        this.dialogVisible = true
      },
      relateCompany() {
        queryRelateCompanyList({departmentId: this.selectId}).then((res) => {
          this.relateCompanyList = res.data
        })
        this.companyVisible = true
      },
      changeSelectId(val) {
        this.selectId = val
      },
      changeParentId(val) {
        this.changeParent = val
      },
      listRefresh(val) {
        if (val) {
          this.refresh = false
        }
      },
      commitParent() {
        let param = {
          id: this.selectId,
          parentDepartmentId: this.changeParent
        }
        updateParentDepartment(param).then((res) => {
          if (res.data) {
            Message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.selectId = null
            this.refresh = true
            this.clearChoose = true
          }
        })
      },
      clearDepartment(val) {
        if (val) {
          this.clearChoose = false
        }
      },
      cancelUpdateParent() {
        this.dialogVisible = false
      },
      chooseCompanyVisible() {
        this.chooseCompanyDialogVisible = true
      },
      closeChooseCompany(val) {
        this.chooseCompanyDialogVisible = val
      },
      chooseCompany(val) {
        for (let i = 0; i<val.length;i++) {
          let flag = false
          for (let j = 0; j<this.relateCompanyList.length; j++) {
            if (val[i].id === this.relateCompanyList[j].id) {
              flag = true
              break
            }
          }
          if (!flag) {
            this.relateCompanyList.push(val[i])
          }
        }
        this.chooseCompanyDialogVisible = false
      },
      selectCompany(val) {
        this.selectRelateCompany = val
      },
      deleteRelateCompany() {
        let relate = []
        for (let i= 0;i<this.selectRelateCompany.length;i++) {
          this.relateCompanyList.splice(this.relateCompanyList.indexOf(this.selectRelateCompany[i]),1)
        }
        this.selectRelateCompany = []
      },
      commitRelateCompany() {
        let relateCompany = []
        for (let i = 0; i<this.relateCompanyList.length;i++) {
          relateCompany.push(this.relateCompanyList[i].id)
        }
        let param = {
          id: this.selectId,
          relateCompany: relateCompany
        }
        insertRelateCompany(param).then((res) => {
          if (res.data) {
            Message({
              message: '设置成功',
              type: 'success'
            })
            this.companyVisible = false
          }
        })
      },
      cancelCommitRelateCompany() {
        this.companyVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .module {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 20px;
  }

  .row-title {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }
</style>
