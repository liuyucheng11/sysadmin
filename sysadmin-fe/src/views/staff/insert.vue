<template>
  <div id="swagger">

    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :rules="rules"
      :model="formLabelAlign"
      :inline="true"
      ref="formLabelAlign"
    >

      <h4>基本信息</h4>
      <hr>

      <el-form-item
        label="员工编号:"
        prop="staffNumber"
        class="item"
      >
        <el-input
          v-model.trim="formLabelAlign.staffNumber"
          placeholder="请输入员工编号"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工姓名:"
        prop="staffName"
        class="item"
      >
        <el-input
          v-model.trim="formLabelAlign.staffName"
          placeholder="请输入员工姓名"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工邮箱:"
        prop="staffEmail"
        class="item"
      >
        <el-input
          v-model.trim="formLabelAlign.staffEmail"
          placeholder="请输入员工邮箱"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="所属部门:"
        prop="departmentId"
        class="item"
      >
        <el-input
          style="width: 230px;"
          v-model.trim="formLabelAlign.departmentName"
          placeholder="请选择所属部门"
          :readonly="true"
        ></el-input>
        <el-button
          type="primary"
          @click="selectDept"
          class="departmentBt"
          v-permission="['/staff/new/new']"
        >选择</el-button>
      </el-form-item>&nbsp;

      <el-form-item
        label="登录账号:"
        class="item"
      >
        <el-input
          v-model.trim="formLabelAlign.accountNo"
          placeholder="请输入登陆账号"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="是否离职:"
        class="item"
      >
        <el-select
          v-model="formLabelAlign.staffIsLeft"
          placeholder="请选择"
          style="width:300px"
          :disabled="true"
        >       
          <el-option
            v-for="item in getIsLeftEnum()"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >             
             </el-option>       
             </el-select>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工手机:"
        prop="staffTelephone"
        class="item"
      >
        <el-input
          v-model.trim="formLabelAlign.staffTelephone"
          placeholder="请输入员工手机"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工性别:"
        class="item"
      >
        <div class="rad">
          <el-radio-group v-model="formLabelAlign.staffSex">
            <el-radio
              :label="item.key"
              :key="item.key"
              v-for="item in getSexEnum()"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <h4>其他信息</h4>
      <hr>

      <el-form-item
        label="新建时间:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.createTime"
          placeholder="新建时间"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="新建人:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.createEmp"
          placeholder="新建人"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="修改时间:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.modifyTime"
          placeholder="修改时间"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="修改人:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.modifyEmp"
          placeholder="修改人"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="备注:"
        class="item"
        prop="remark"
      >
        <el-input
          type="textarea"
          :rows="3"
          v-model="formLabelAlign.remark"
          placeholder="备注"
          style="width:737px"
        ></el-input>
      </el-form-item>&nbsp;

    </el-form>

    <div class="btnRow">
      <el-button
        type="primary"
        @click="submitForm('formLabelAlign')"
        class="selectbtn"
        v-permission="['/staff/new/new']"
      >保存</el-button>
      <el-button
        type="primary"
        @click="toIndex"
        class="exportbtn"
        v-permission="['/staff/new/new']"
      >取消</el-button>
    </div>

    <div>
      <el-dialog
        title="请选择部门"
        :visible.sync="dialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="commitSelectDept()"
            v-permission="['/staff/new/new']"
          >确定</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectDept()"
            v-permission="['/staff/new/new']"
          >取消</el-button>
        </el-row>
        <department-tree
          :return-name="true"
          @selectId="changeDeptId"
          :clear-choose="clearChoose"
          @clear="clear"
        ></department-tree>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { insertStaff } from "../../api/staff";
import DepartmentTree from "../department/departmentTree";
// import rules from "@/utils/rules";
import { getDictName, getEnum } from "./enumUtil";

export default {
  name: "insertStaff",
  components: { DepartmentTree },
  props: {},
  data() {
    var checkStaffNumber = (rule, value, callback) => {
      const reg = /^[0-9]*[1-9][0-9]*$/
      if (!value) {
          return callback(new Error('请填写整数'))
      } else if (!reg.test(value)) {
          return callback(new Error('请输入整数'))
      } else {
          callback()
      }
    }
    return {
      // rules,
      clearChoose: false,
      labelPosition: "right",
      dialogVisible: false,
      formLabelAlign: {
        staffNumber: "",
        staffName: "",
        staffSex: "",
        staffTelephone: "",
        staffEmail: "",
        staffIsLeft: 0,
        accountNo: "",
        status: 1,
        departmentId: "",
        departmentName: "",
        remark: "",
        createEmp: "",
        createTime: "",
        modifyEmp: "",
        modifyTime: ""
      },
      departId: "",
      departName: "",
      // 整数
      rules: {
        staffTelephone: [
          { required: true, message: " 必填", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
            trigger: "blur"
          },
          { min: 11, max: 11, message: " 手机号为11位", trigger: "blur" }
        ],
        staffNumber: [
          { required: true, message: "必填", trigger: "blur" },
          { min: 1, max: 20, message: " 编号长度为1-20位", trigger: "blur" },
          { validator: checkStaffNumber, trigger:'blur'}
        ],
        staffName: [
          { required: true, message: " 必填", trigger: "blur" },
          { min: 1, max: 30, message: "姓名长度为1-30位", trigger: "blur" }
        ],
        departmentId: [{ required: true, message: " 必填", trigger: "change" }],
        staffEmail: [
          { required: false, message: " 必填", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
          { min: 1, max: 30, message: "邮箱长度为1-30位", trigger: "blur" }
        ],
        remark: [
          { required: false, trigger: "change" },
          { min: 1, max: 200, message: "备注长度为1-200", trigger: "blur" }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    insertData() {
      let this_ = this;
      insertStaff(this_.formLabelAlign)
        .then(result => {
          if(result.code === 200) {
            this.$message({showClose: true,message: result.message,type: "success"});
            this.toIndex();
          }
        })
        .catch(error => {
          
        });
    },

    selectDept() {
      this.dialogVisible = true;
    },
    cancelSelectDept() {
      this.formLabelAlign.departmentName = null;
      this.formLabelAlign.departmentId = null;
      this.clearChoose = true;
      this.dialogVisible = false;
    },
    commitSelectDept() {
      this.formLabelAlign.departmentId = this.departId;
      this.formLabelAlign.departmentName = this.departName;
      this.clearChoose = true;
      this.dialogVisible = false;
    },
    changeDeptId(val) {
      this.departId = val.id;
      this.departName = val.name;
      // this.formLabelAlign.departmentId = val.id;
      // this.formLabelAlign.departmentName = val.name;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.insertData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getIsLeftEnum() {
      return getEnum("isLeft");
    },
    getSexEnum() {
      return getEnum("sex");
    },
    toIndex() {
      console.log("to index");
      this.$store.dispatch("tagsView/delVisitedView", this.$route);
      this.$router.push({ name: "staffIndex" });
      // this.$router.go(-1);
    },
    clear(val) {
      if (val) {
        this.clearChoose = false;
      }
    }
  },
  created() {},
  mounted() {
    // 只能获取一次（刷新失效）
    // this.createEmp = this.$store.getters.nowLogin.id;
    // this.modifyEmp = this.$store.getters.nowLogin.id;
  }
};
</script>
<style lang="scss" scoped>
h4 {
  padding-left: 30px;
}
.input {
  height: 12px;
  width: 300px;
}
.item {
  padding-left: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.btnRow {
  padding: 20px;
  text-align: center;
}
.selectbtn {
  margin-left: auto;
  margin-right: auto;
}
.exportbtn {
  margin-left: auto;
  margin-right: auto;
}
.departmentBt {
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  width: 65px;
  height: 36px;
  vertical-align: middle;
}
</style>
