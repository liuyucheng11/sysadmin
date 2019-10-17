<template>
  <div id="swagger">
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      :inline="true"
      style="padding:30px"
    >
      <el-row>
        <el-form-item label="员工编号" prop class="item">
          <el-input
            v-model="formLabelAlign.staffNumber"
            placeholder="员工编号"
            class="input"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="员工姓名" prop class="item">
          <el-input
            v-model="formLabelAlign.staffName"
            placeholder="员工姓名"
            class="input"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="员工手机" prop class="item">
          <el-input
            v-model="formLabelAlign.staffTelephone"
            placeholder="员工手机"
            class="input"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="员工性别" prop class="item">
          <div class="rad">
            <el-radio-group v-model="formLabelAlign.staffSex">
              <el-radio
                :label="item.key"
                :key="item.key"
                v-for="item in getSexEnum()"
                :disabled="true"
              >{{item.value}}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="当前归属部门" prop class="item">
          <el-input
            v-model="formLabelAlign.beforeDepartmentName"
            placeholder="当前归属部门"
            class="input"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="departmentName" label="调整后归属部门" :rules="rules.requiredTrue">
          <el-input
           :rules="rules.requiredTrue"
            v-model="formLabelAlign.departmentName"
            placeholder="请选择所属部门"
            class="input"
            style="width:175px"
            :readonly="true"
          ></el-input>
          <el-button type="primary" @click="selectDept" class="departmentBt">选择</el-button>&nbsp;
        </el-form-item>
      </el-row>

      <div class="btnRow">
        <el-button type="primary" @click="save" class="selectbtn">保存</el-button>
        <el-button type="primary" @click="close" class="exportbtn">取消</el-button>
      </div>
    </el-form>

    <div>
      <el-dialog title="请选择部门" :visible.sync="dialogVisible">
        <el-row>
          <el-button type="primary" icon="el-icon-upload" @click="commitSelectDept()">确定</el-button>
          <!-- :disabled="canPointChoose" -->
          <el-button type="primary" icon="el-icon-delete" @click="cancelSelectDept()">取消</el-button>
          <el-button type="primary" icon="el-icon-remove-outline" @click="clearSelectDept()">清空</el-button>
        </el-row>
        <department-tree
          :return-name="true"
          @selectId="changeDeptId"
          :clear-choose="clearChoose"
          @clear="clear"
        ></department-tree>
        <!-- :staff='selectId'
        :page='page'-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { updateDepartment } from "@/api/staff";
import DepartmentTree from "../department/departmentTree";
import staffEnum from "./staffEnum";
import rules from "@/utils/rules";
import { getDictName, getEnum } from "./enumUtil";
export default {
  components: { DepartmentTree },
  props: {},
  data() {
    return {
      rules,
      departmentId: "",
      departmentName: "",
      labelPosition: "right",
      formLabelAlign: {
        // 当前选择的id
        id: "",
        staffNumber: "",
        staffName: "",
        staffSex: "",
        staffTelephone: "",
        departmentName: "",
        departmentId: ""
      },
      clearChoose: false,
      dialogVisible: false,

      selectId: "",
      page: "staff",
      //departmentId,
      // 分配部门
      departmentId2: "",
      departmentName2: ""
    };
  },
  mounted() {
    this.formLabelAlign = this.$route.query.formLabelAlign;
  },
  methods: {
    getSexEnum() {
      return getEnum("sex");
    },
    selectDept() {
      this.dialogVisible = true;
      //this.canPointChoose = true;
      this.departmentId = this.$route.query.formLabelAlign.departmentId;
      this.departmentName = this.$route.query.formLabelAlign.departmentName;
    },
    cancelSelectDept() {
      if (
        this.formLabelAlign.departmentName === null ||
        this.formLabelAlign.departmentName === ""
      ) {
        this.clearChoose = true;
      }
      this.dialogVisible = false;
    },
    commitSelectDept() {
      this.formLabelAlign.departmentId = this.departmentId;
      this.formLabelAlign.departmentName = this.departmentName;
      //this.clearChoose = true;
      this.dialogVisible = false;
    },
    changeDeptId(val) {
      if (val.id) {
        this.departmentId = val.id;
        this.departmentName = val.name;
        //this.canPointChoose = false;
      }
    },
    clearSelectDept() {
      //清空部门
      this.clearChoose = true;
      this.departmentId = null;
      this.departmentName = null;
      //清空输入框
      //this.formLabelAlign.departmentId = null
      //this.formLabelAlign.departmentName = null
    },

    // 修改(分配)部门
    updateDepartment() {
      let this_ = this;
      let param = {
        id: this_.formLabelAlign.id,
        departmentId: this.formLabelAlign.departmentId,
        status: this.$route.query.formLabelAlign.status
      };
      console.log(param);
      updateDepartment(param)
        .then(result => {
          this.$message({
            showClose: true,
            message: "分配成功",
            type: "success"
          });
          this.$store.dispatch("tagsView/delVisitedView", this.$route);
          this.$router.go(-1);
        })
        .catch(error => {
          if (error === "该员工已离职, 无法进行操作") {
            this.$store.dispatch("tagsView/delVisitedView", this.$route);
            this.$router.go(-1);
          }
        });
    },
    clear(val) {
      if (val) {
        this.clearChoose = false;
      }
    },
    //保存
    save() {
      this.updateDepartment();
    },
    //取消
    close() {
      this.$store.dispatch("tagsView/delVisitedView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.btnRow {
  padding: 20px;
  margin-left: 60px;
  /* text-align: center; */
}
.selectbtn {
  margin-left: auto;
  margin-right: auto;
}
.exportbtn {
  margin-left: auto;
  margin-right: auto;
}
</style>