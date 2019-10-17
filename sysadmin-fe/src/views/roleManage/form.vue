<template>
  <div style="margin:10px">
    <el-row class="row-title">
      <h3>账号信息</h3>
      <el-button
        type="primary"
        style="width: 75px;margin-left: 950px"
        @click="submitForm('ruleForm')"
        >保 存</el-button
      >
      <el-button type="primary" style="width: 75px" @click="onBack"
        >取 消</el-button
      >
    </el-row>
    <el-form
      :model="ruleForm"
      :rules="rules"
      :inline="true"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="角色ID" prop="id">
        <el-input style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="审批人账号" prop="approverAccount">
        <el-input
          v-model="ruleForm.approverAccount"
          style="width:300px"
          disabled
        >
          <el-button
            style="background:#1E90FF;color:white"
            slot="append"
            @click="toApproverQuery"
            >选 择</el-button
          >
        </el-input>
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
      <el-form-item label="支持业务线" prop="business">
        <el-checkbox-group v-model="ruleForm.business">
          <el-checkbox label="买买车" name="business"></el-checkbox>
          <el-checkbox label="闪贷" name="business"></el-checkbox>
          <el-checkbox label="租车" name="business"></el-checkbox>
          <el-checkbox label="专车" name="business"></el-checkbox>
          <el-checkbox label="保险" name="business"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          style="width:760px"
        ></el-input>
      </el-form-item>
      <el-row class="row-title">
        <h3>其他信息</h3>
      </el-row>
      <el-form-item label="新建人" prop="createEmp">
        <el-input style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="新建时间" prop="createTime">
        <el-input style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="修改人" prop="modifyEmp">
        <el-input style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="modifyTime">
        <el-input style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input style="width:300px" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import roleManageApi from "@/api/roleManage";
export default {
  data() {
    let testRoleName = (rule, value, callback) => {
		//查询测试批次号是否重复
		roleManageApi.queryTotalByName(this.ruleForm.roleName).then(res => {
			console.log(res);
			if (res.data <= 0) {
				callback()
			} else if (res.data > 0) {
				callback('角色名称已经存在')
			}
		})
	}

    return {
      ruleForm: {
        id:'',
        roleName: "",
        approverId:"",
        approverAccount: "",
        approverNumber: "",
        approverName: "",
        approverDepartment: "",
        business: [],

      },

      rules: {
        roleName: [
          { required: true, message: "角色名不允许为空", trigger: "change" },
          { validator:testRoleName, trigger: 'blur' },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "change" }
        ],
        approverAccount: [
          { required: true, message: "审批人账号不允许为空", trigger: "change" }
        ],
        business: [
          { required: true, message: "支持业务线不允许为空", trigger: "change" },
        ],
        remark: [
          { min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "change" }
        ],
       
      }
    };
  },
  created() {
    this.setForm();
  },
  methods: {
    submitForm(formName) {
      //效验
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          this.createRole();
        } else {
          this.$message.error('新建信息填写错误！请按要求填写');
          return false;
        }
      });
    },

    createRole() {
      console.log(this.ruleForm);
      roleManageApi
        .createRole(JSON.stringify(this.ruleForm))
        .then(response => {
          this.$message({
          message: '恭喜你，创建成功',
          type: 'success'
        });
        this.$store.dispatch("tagsView/delVisitedView", this.$route);
          this.$router.push({
            name: "RoleManage"
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields(); //重置
    },

    setForm() {
      if (this.$route.params.ruleForm != null) {
        this.ruleForm = this.$route.params.ruleForm;
      }
    },



    toApproverQuery() {
      //跳转至账号选择界面
      console.log(this.ruleForm.business);
      this.$router.push({
        name: "ApproverQuery",
        params: {
          ruleForm: this.ruleForm
        }
      });
    },
    onBack() {
      //回到列表页
      this.$store.dispatch("tagsView/delVisitedView", this.$route);
      this.$router.push({
        name: "RoleManage"
      });
       
    }
  }
};
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