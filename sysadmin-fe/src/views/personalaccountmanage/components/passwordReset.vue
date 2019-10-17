<template>
  <el-card class="box-card">
	 <div slot="header" class="clearfix">
		 <span style="color:#409EFF">密码重置</span>
	 </div>
	 <div class="text item">
		 <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
		   <el-form-item label=" " prop="oldPass"  class="tip">
		     <el-input type="password"  v-model="ruleForm.oldPass" placeholder="请输入当前登录密码" show-password autocomplete="off"></el-input>
		   </el-form-item>
		   <el-form-item label=" " prop="newPass" class="tip">
		     <el-input type="password" v-model="ruleForm.newPass" placeholder="请输入新密码" show-password autocomplete="off"></el-input>
		   </el-form-item>
		   <el-form-item label=" " prop="checkPass" class="tip">
		     <el-input type="password" v-model="ruleForm.checkPass" placeholder="请输入确认密码" show-password autocomplete="off"></el-input>
		   </el-form-item>
		   
		   <el-form-item>
		     <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		     <el-button @click="resetForm('ruleForm')">重置</el-button>
		   </el-form-item>
		 </el-form>
	 </div>
	
  
	 
  </el-card>
</template>

<script>
	import { getToken, setToken, removeToken } from '@/utils/auth'
	import{modifyPassword} from "@/api/personalAccountManage"
	 export default {
      data() {
      var checkOldPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('当前登录密码不能为空'));
        }else{
		  callback();
		    }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        }  else if(!this.checkPassWord.test(value)){
					callback(new Error('至少包含数字、大写字母、小写字母、特殊字符中的三种类型，长度6-16'));
				}else if(value===this.ruleForm.oldPass){
					callback(new Error('新密码不能与当前登录密码一致'));
				}
				else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
				
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.newPass) {
          callback(new Error('两次输入密码不一致!'));
        }  else if (!this.checkPassWord.test(value)) {
        callback(new Error('至少包含数字、大写字母、小写字母、特殊字符中的三种类型，长度6-16'))
				}
				else {
          callback();
        }
      };
			
      return {
				checkPassWord: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,16}$/,
				ruleForm: {
          newPass: '',
          checkPass: '',
          oldPass: '',
					
        },
        rules: {
          newPass: [
            { validator: validatePass, trigger: 'blur' ,required:'true'}
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' ,required:'true'}
          ],
          oldPass: [
            { validator: checkOldPass, trigger: 'blur',required:'true' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
				var self=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
						let param={oldPassword:self.ruleForm.oldPass,newPassword:self.ruleForm.newPass,accountId:this.$store.getters.nowLogin.id};
						modifyPassword(JSON.stringify(param)).then((result)=>{
					  this.$message("密码修改成功，请重新登录！");
						removeToken();
					  this.$router.push({path: '/login'});
						}).catch((error)=>{
						})
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style>
  .flag{
	  color:red;
	  font-size: 16px;
  }
  .text {
    font-size: 16px;
	width:60%;
	margin: auto;
  }

  .item {
    margin-bottom: 18px;
  }
	.tip{
		margin-bottom: 50px;
	}

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
	margin: auto;
	margin-top: 40px;
    width: 480px;
  }
</style>
