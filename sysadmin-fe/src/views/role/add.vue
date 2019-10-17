<template>
  <div style="margin-bottom: 100px">
    <div class="module">
      <el-card>
        <el-row class="row-title">
          <h2>申请信息</h2>
        </el-row>
        <el-form :model="addForm" style="margin-top: 50px" inline="true">
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="角色申请编号">
                <el-input v-model="addForm.account"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="申请角色">
                <el-input v-model="addForm.pass" show-password></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="角色审批人">

                <el-input v-model="addForm.sno"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="角色支持业务线">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="数据权限类型">
                <el-select v-model="addForm.limit" placeholder="全部">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="密保邮箱">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-title">
            <h2>其他信息</h2>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="新建人">
                <el-input v-model="addForm.createEmp" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="新建时间">
                <el-input v-model="addForm.createTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="修改人">
                <el-input v-model="addForm.modifyEmp" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="修改时间">
                <el-input v-model="addForm.modifyTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="账号状态">
                <el-input v-model="addForm.status" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="备注">
                <el-input v-model="addForm.commit" type="textarea" :rows="2"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "add",
    data() {
      return {
        options: [
          {
            value: 0,
            label: '全部',
          },
          {
            value: 1,
            label: '本部门',
          },
          {
            value: 2,
            label: '递归',
          },
          {
            value: 3,
            label: '本人',
          },
          {
            value: 4,
            label: '手动选择',
          },
        ],
        addForm: {
          account: '',
          pass: '',
          sno: '',
          name: '',
          status: '',
          email: '',
          createEmp: '',
          modifyEmp: '',
          commit: ''
        }
      }
    },
  }

</script>

<style scoped>
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
  .text-size {
    font-size: 25px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>

