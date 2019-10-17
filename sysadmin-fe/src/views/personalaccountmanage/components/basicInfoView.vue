<template>
	<div>
  <el-card class="box-card">
	 <div slot="header" class="clearfix">
		 <span style="color:#409EFF">个人基本信息</span>
	 </div>
     <div class="text item">
        员工编号：{{staffInfo.staffNumber}}
     </div>
	 <div class="text item">
	    员工姓名:{{staffInfo.staffName}}
	 </div>
	 <div class="text item" v-if="staffInfo.staffNumber==null">
	    性别:
	 </div>
	 <div class="text item" v-else="staffInfo.staffNumber">
	    性别:{{staffInfo.staffSex===1 ? '男':'女'}}
	 </div>
	 <div class="text item">
	    员工手机:{{staffInfo.staffTelephone}}
	 </div>
	 <div class="text item">
	    员工邮箱:{{staffInfo.staffEmail}}
	 </div>
	 <div class="text item">
	    归属部门:{{staffInfo.departName}}
	 </div>
	  <div class="text item" v-if="staffInfo.staffNumber==null">
	    是否离职:
	 </div>
	 <div class="text item" v-else="staffInfo.staffNumber">
	   是否离职:{{staffInfo.staffIsLeft===1?'离职':'在职'}}
	 </div>
  </el-card>
  </div>
</template>

<script>
	import { getToken, setToken, removeToken } from '@/utils/auth'
	import{getStaffInfoByUserName} from "@/api/personalAccountManage"
	export default{
		data(){
			return{
				
				staffInfo:''
			}
		},
		methods:{
			getInfo(){
				var self = this;
				getStaffInfoByUserName().then((result)=>{
		      self.staffInfo=result.data;
				}).catch((error)=>{
					console.log(error);
				})
			}
		},
		mounted(){
			this.getInfo();
		},
		activated(){
			this.getInfo();
		}
	}
</script>

<style>
	
    td{
		border:1px solid;
		width: 220px;
		height: 40px;	
	}
	td:nth-child(odd){
		text-align: right;
	}
	td:nth-child(even){
		text-align:left;
		padding-left: 5px;
	}
	table{
		border-collapse: collapse;
		margin:40px auto;
	}
  .text {
    font-size: 16px;
  }

  .item {
    margin-bottom: 18px;
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
