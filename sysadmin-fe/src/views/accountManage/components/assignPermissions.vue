<template>
  <div>
    <el-transfer
      v-model="remainRole"
      :props="{key:'roleId',label:'roleName'}"
      :data="allRole"
      :titles="['已拥有角色','可分配角色']"
      class="transfer"
      @change="saveButtonShow"
    >
    </el-transfer>
    <br />
    <h3 style="margin-left: 10px;">
      给【{{this.accountNo}}】分配特殊权限
      <el-button style="margin-left: 10px;" type="primary" size="mini" @click="saveAll" :disabled="canSave">保存</el-button>
			 <el-button style="margin-left: 10px;" type="primary" size="mini" @click="cancleData">取消</el-button>
    </h3>
    <div>
      <permission-tree
        style="margin-left: 20px;"
        :accountPer="accountPer"
		    :page='page'
        v-on:menu-select-account="changeParentAccountId"
      ></permission-tree>
    </div>
  </div>
</template>

<script>
import {
  getAccountNoById,
  getAllRoleList,
  getRemainRoleIdList,
  updateAccountRole
} from "@/api/accountManage.js";
import PermissionTree from "@/views/authority/permissionTree";
import { getAccountPerById, addAccountPer, cancelAccount } from "@/api/authority";
export default {
  components: { PermissionTree },
  data() {
    return {
      isss: true,
      accountId: "",
      accountNo: "",
      remainRole: [],
      allRole: [],
      isChange1: false,
			isChange2: false,
      data: "",

      accountPer: [],
      ids: [],
	  param: [],
	  page: 'account',
	  canSave: true
    };
  },
  beforeUpdate() {
    console.log("aaa");
  },
  updated() {
    console.log("bbb");
  },
  watch: {
    accountNo(oldValue, newValue) {
      console.log("=====watch=======");
      console.log(oldValue, newValue);
    }
  },
  methods: {
    saveButtonShow(res) {
			this.isChange1=true;
      this.canSave = false;
    },
    getAllRole() {
      let self = this;
      getAllRoleList()
        .then(result => {
         var data = result.data;
					for(var i=0;i<data.length;i++)
					{
						if(data[i].roleId==24)
						{
							self.allRole.push({
								roleId:data[i].roleId,
								roleName:data[i].roleName,
								disabled:true
							})
						}else{
							self.allRole.push({
								roleId:data[i].roleId,
								roleName:data[i].roleName,
								disabled:false
							})
						}

					}
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAccountNo() {
      let self = this;
      getAccountNoById(self.accountId)
        .then(result => {
          self.accountNo = result.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRemainRoleIdList() {
      let self = this;
      getRemainRoleIdList(self.accountId)
        .then(result => {
          self.remainRole = result.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    saveData() {
      var s = "";
      for (var i = 0; i < this.remainRole.length; i++) {
        s += this.remainRole[i] + ",";
      }
      let self = this;
      let param = new FormData();
      param.append("remainRoleIds", s);
      param.append("accountId", self.accountId);
      updateAccountRole(param)
        .then(() => {
          this.$message("角色分配成功");
					this.$store.dispatch('tagsView/delVisitedView',this.$route);
					this.$router.go(-1);
        })
        .catch(error => {
          this.$message(error);
        });
    },
		cancleData(){
      //cancelAccount({accountId:this.accountId}).then(result => {}).catch();
			this.$store.dispatch('tagsView/delVisitedView',this.$route);
			this.$router.go(-1);
		},

    changeParentAccountId(ids) {
      console.log(`当前选中节点 ${ids}`);
	    this.ids = ids;
			this.isChange2=true;
			this.canSave = false;

    },
		saveAll(){
			if(this.isChange1)
			{
				this.saveData();
			}
			if(this.isChange2)
			{
				this.savePer();
			}
		},
    savePer() {
      if (this.ids.length !== 0) {
        for (let id of this.ids) {
          this.param.push({accountId: this.accountId, permissionId: id});
        }
      }
      if (this.ids.length === 0) {
        this.param.push({accountId: this.accountId, permissionId: 0});
      }
      console.log(`account 传参 ${this.param}`);
      addAccountPer(JSON.stringify(this.param))
        .then(result => {
          if (result.code === 200) {
            this.$alert("权限分配成功", "提示信息", {
              confirmButtonText: "确定",
              callback: action => {
								this.$store.dispatch('tagsView/delVisitedView',this.$route);
                this.$router.go(-1);
              }
            })
          }  
        })
        .catch();
    }
  },
  created() {
    this.accountId = this.$route.params.accountIdPer;
    this.getRemainRoleIdList();
    this.getAllRole();
    this.getAccountNo();

    //获取当前选中的节点
    let _this = this;
    getAccountPerById({accountId:this.accountId}).then(result => {
      for (let i = 0; i < result.data.length; i++) {
        _this.accountPer[i] = result.data[i].permissionId;
      }
    }).catch(error => {
      this.$store.dispatch('tagsView/delVisitedView',this.$route);
      this.$router.go(-1);
    })
  },
  beforeDestroy(){}
};
</script>

<style>
.transfer {
  margin-left: 20px;
  margin-top: 10px;
}
.transfer-footer {
  margin-left: 150px;
  padding: 6px 5px;
}
</style>
