<template>
  <div style="margin:10px">
    <el-row class="row-title">
      <h3>角色信息</h3>
      <el-button
        type="primary"
        style="width: 75px;margin-left: 765px"
        @click="onBack"
        >取 消</el-button
      >
    </el-row>
    <el-form
      :model="ruleForm"
      :inline="true"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="角色ID" prop="id">
        <el-input v-model="ruleForm.id" style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="ruleForm.roleName"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="审批人账号" prop="approverAccount">
        <el-input
          v-model="ruleForm.approverAccount"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="审批人员工编号" prop="approverNumber">
        <el-input
          v-model="ruleForm.approverNumber"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="审批人姓名" prop="approverName">
        <el-input
          v-model="ruleForm.approverName"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="审批人所属部门" prop="approverDepartment">
        <el-input
          v-model="ruleForm.approverDepartment"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="支持业务线">
        <el-input v-model="business" style="width:760px" disabled></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          style="width:760px"
          disabled
        ></el-input>
      </el-form-item>
      <el-row class="row-title">
        <h3>其他信息</h3>
      </el-row>
      <el-form-item label="新建人" prop="createEmp">
        <el-input
          v-model="ruleForm.createEmp"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="新建时间" prop="createTime">
        <el-input
          v-model="ruleForm.createTime"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="修改人" prop="modifyEmp">
        <el-input
          v-model="ruleForm.modifyEmp"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="modifyTime">
        <el-input
          v-model="ruleForm.modifyTime"
          style="width:300px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input value="有效" style="width:300px" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import roleManageApi from "@/api/roleManage";
  export default {
    data() {
      return {
        business:'',
        ruleForm: {
        },
      };
    },
    created(){
        this.getRoleManage();
    },

    methods: {
      onBack(){
        //返回到列表页
        this.$store.dispatch("tagsView/delVisitedView", this.$route);
        this.$router.push({
        name: "RoleManage",
        });
      },
      getRoleManage() {
      //根据id获取角色详情
      roleManageApi
        .findById(this.$route.params.id)
        .then(response => {
          this.ruleForm = response.data;
          this.business = response.data.business.join(';')
        })
        .catch(error => {
          console.log(error);
        });
      },

    }
  }
</script>

<style scoped>
.row-title {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
</style>