<template>
  <div>
    <div class="actions">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>

    <div class="form-container">
      <el-form :model="company" :rules="checkRules" ref="form">
        <div class="base-info">
          <div class="container-title">基本信息</div>
          <el-row class="row">
            <el-col :span="8">
              <el-form-item label="公司名称:" prop="companyName">
                <div class="form-item">
                  <span class="must-need">*</span>
                  <el-input v-model="company.companyName" placeholder="请输入公司名称" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="统一社会信用代码:" prop="unifiedSocialCreditCode">
                <div class="form-item">
                  <span class="must-need">*</span>
                  <el-input v-model="company.unifiedSocialCreditCode" placeholder="输入统一社会信用代码"
                            style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="8">
              <el-form-item label="类型:" prop="companyType" clearable="true">
                <div class="form-item">
                  <el-select v-model="company.companyType">
                    <el-option v-for="(item, index) in options"
                               :key="index"
                               :value="item.value"
                               :label="item.label"></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业期限:">
                <div class="form-item">
                  <el-date-picker
                    v-model="company.startBusinessTerm"
                    type="date"
                    placeholder="选择起始日期">
                  </el-date-picker>&nbsp;-&nbsp;
                  <el-date-picker
                    v-model="company.endBusinessTerm"
                    type="date"
                    placeholder="选择结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="8">
              <el-form-item label="住所:" prop="location">
                <div class="form-item">

                  <el-input v-model="company.location" placeholder="输入住所" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item prop="businessScope" label="经营范围:">
                <div class="form-item">
                  <el-input v-model="company.businessScope" placeholder="输入经营范围" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="10">
              <el-form-item prop="legalRepresentative" label="法定代表人：">
                <div class="form-item">

                  <el-input v-model="company.legalRepresentative" placeholder="输入法定代表人" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="注册资本:" prop="registeredCapital">
                <div class="form-item">

                  <el-input v-model="company.registeredCapital" placeholder="输入注册资本" style="width: 300px">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="8">
              <el-form-item label="成立日期:" prop="establishmentDate">
                <div class="form-item">
                  <el-date-picker
                    v-model="company.establishmentDate"
                    type="date"
                    placeholder="成立日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="登记机关:" prop="registrationAuthority">
                <div class="form-item">
                  <el-input
                    v-model="company.registrationAuthority"
                    placeholder="输入登记机关" style="width: 300px">
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="8">
              <el-form-item prop="approvalDate" label="核准日期">
                <div class="form-item">
                  <el-date-picker
                    v-model="company.approvalDate"
                    type="date"
                    placeholder="输入核准日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item prop="registrationStatus" label="登记状态:">
                <div class="form-item">
                  <el-input
                    v-model="company.registrationStatus"
                    placeholder="输入登记状态" style="width: 300px">
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <hr/>
        <div class="annex-information">
          <div class="container-title">附件信息</div>
          营业执照附件:
          <div>
            <el-upload
              multiple
              class="upload-demo"
              ref="upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              action=""
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
              :on-change="handleChange"
              list-type="picture"
              :auto-upload="false"
              :limit=20
              :on-exceed="handleOnExceed"
              :http-request="uploadLicenses">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </div>
        <hr>

        <div class="invoice-information">
          <div class="container-title">发票信息</div>
          <el-row class='row'>
            <el-col :span="8">
              <el-form-item label="公司性质:">
                <div class="form-item" style="margin-top: 8px">
                  <el-radio-group v-model="company.corporateNature">
                    <el-radio @click.native.prevent="clickNature(0)" :label="0">一般纳税人</el-radio>
                    <el-radio @click.native.prevent="clickNature(1)" :label="1">小规模纳税人</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="registerLocation" label="注册地址:">
                <div class="form-item">
                  <el-input v-model="company.registerLocation" placeholder="输入注册地址" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">

            <el-col :span="8">
              <el-form-item label="开户银行:" prop="bank">
                <div class="form-item">
                  <el-input v-model="company.bank" placeholder="输入开户银行" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item prop="companyAccount" label="账号:">
                <div class="form-item">
                  <el-input v-model="company.companyAccount" placeholder="输入银行卡号" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="8">
              <el-form-item prop="registerTelephone" label="注册电话:">
                <div class="form-item">
                  <el-input v-model="company.registerTelephone" placeholder="输入注册电话" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="总公司标识:" prop="headOfficeFlag">
                <div class="form-item" style="margin-top: 8px">
                  <el-radio-group v-model="company.headOfficeFlag">
                    <el-radio @click.native.prevent="clickOffice(0)" :label="0">总公司</el-radio>
                    <el-radio @click.native.prevent="clickOffice(1)" :label="1">子公司</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <hr>
        <div class="other-information">
          <div class="container-title">其他信息</div>
          <el-row class="row">
            <el-col :span="8">
              <el-form-item label="新建人">
                <div class="form-item">
                  <el-input v-model="company.createEmp" readonly="true" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人:">
                <div class="form-item">
                  <el-input v-model="company.createTime" readonly="true" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="8">
              <el-form-item label="修改人:">
                <div class="form-item">
                  <el-input v-model="company.modifyEmp" readonly="true" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修改时间:">
                <div class="form-item">
                  <el-input v-model="company.modifyTime" readonly="true" style="width: 300px"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-form-item prop="remark" label="备注:">
              <div class="form-item">
                <el-input type="textarea" v-model="company.remark" :rows="4" style="width: 600px"></el-input>
              </div>
            </el-form-item>

          </el-row>

        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
  import {addCompany} from "../../api/company.js";

  export default {
    name: "add",
    data() {
      var checkCode_ = (rule, val, callBack) => {
        if (!val) {
          callBack(new Error("校验码不能为空"));
        }
        else {
          if (!this.checkCreditCode.test(val)) {
            callBack(new Error("校验码15或者18个字符"));
          }
          else {
            callBack();
          }
        }
      };
      var checkPhone_ = (rule, val, callback) => {
        if (val === '' || val == null) {
          callback();
        } else {
          if (!this.checkPhone.test(val)) {
            callback(new Error("电话号码只能为11-12位数字"))
          } else {
            callback();
          }
        }
      };
      var checkAccount_ = (r, v, c) => {
        if (v === '' || v == null) {
          c();
        } else {
          if (!this.checkAccount.test(v)) {
            c(new Error("账户只能为7-20位数字"));
          }
          else {
            c();
          }
        }
      };
      var checkRegistrationAuthority_ = (r, v, c) => {
        if (v == null || v === '') {
          c();
        } else {
          if (!this.checkRegistrationAuthority.test(v)) {
            c(new Error("登记机关输入2-60个字符"));
          } else c();
        }
      };
      var checkCompanyName_ = (r, v, c) => {
        if (v === '' || v == null) {
          c(Error("公司名不能为空"));
        } else {

          if (!this.checkCompanyName.test(v)) {
            c(new Error("公司名只能为2-60字符"));
          } else {
            c();
          }
        }
      };
      var checkBank_ = (r, v, c) => {
        if (v == null || v === '') {
          c();
        } else {
          if (!this.checkBank.test(v)) {
            c(new Error("银行只能为2-60位字符!"));
          } else {
            c();
          }
        }
      };
      var checkRegisteredCapital_ = (r, v, c) => {
        if (v === '' || v == null) {
          c(new Error("注册资本为必填！"));
        } else {
          if (!this.checkRegisteredCapital.test(v)) {
            c(new Error("注册资本只支持1-20为数字!"))
          } else {
            c();
          }
        }
      };
      var approvalDate_ = (r, v, c) => {
        if (v === '' || v == null) {
          c(new Error("核准日期为必填"))
        } else {
          var curDate = new Date();
          var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
          if (v > preDate) {
            c(new Error("核准日期应在当前日期前"))
          } else {
            c();
          }
        }
      };
      var location_ = (r, v, c) => {
        if (v === '' || v === null) {
          c();
        } else {
          if (!this.checkLocation.test(v)) {
            return c(new Error("住所为2-100字符"))
          } else {
            c();
          }
        }
      };
      var businessScope_ = (r, v, c) => {
        if (v === '' || v === null) {
          c();
        } else {
          if (!this.checkBusinessScope.test(v)) {
            return c(new Error("经营范围为2-200字符"))
          } else {
            c();
          }
        }
      };
      var registrationStatus_ = (r, v, c) => {
        if (v === '' || v == null) {
          c();
        } else {
          if (!this.checkRegistrationStatus.test(v)) {
            c(Error("状态为2-60个字符"))
          } else {
            c();
          }
        }
      };
      var establishmentDate_ = (r, v, c) => {
        if (v === '' || v == null) {
          c(new Error("成立日期为必填"))
        } else {
          var curDate = new Date();
          var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
          if (v > preDate) {
            c(new Error("成立日期应在当前日期前"))
          } else {
            c();
          }
        }
      };
      var checklegalRepresentative_ = (r, v, c) => {
        if (v === '' || v == null) {
          c();
        } else {
          if (!this.checkRegistrationStatus.test(v)) {
            c(Error("法人代表为2-60个字符"))
          } else {
            c();
          }
        }
      };
      var registerLocation_ = (r, v, c) => {
        if (v === '' || v == null) {
          c();
        } else {
          if (!this.checkRegistrationStatus.test(v)) {
            c(Error("注册地址为2-60个字符"))
          } else {
            c();
          }
        }
      }
      return {
        company: {
          companyName: '',
          unifiedSocialCreditCode: '',
          companyType: null,
          startBusinessTerm: null,
          endBusinessTerm: null,
          location: null,
          businessScope: null,
          legalRepresentative: null,
          registeredCapital: null,
          establishmentDate: null,
          registrationAuthority: null,
          approvalDate: null,
          corporateNature: null,
          registrationStatus: null,
          bank: '',
          companyAccount: '',
          registerTelephone: null,
          headOfficeFlag: null,
          remark: '',
          modifyTime: '',
          businessLicenses: null,
          registerLocation: '',
        },
        iscommit: true,
        options: [{label: '有限责任公司', value: 0}, {label: '股份有限公司', value: 1}],
        uploadUrl: 'aaa',
        fileList: [],
        uploadFiles: [],
        formData: new FormData(),
        checkCreditCode: /(^\w{15}$)|(^\w{18}$)/,
        checkRegisteredCapital: /^(\d{1,20})$/,
        checkPhone: /^\d{11,12}$/,
        checkAccount: /^\d{7,20}$/,
        checkCompanyName: /^(\w|[\u4e00-\u9fa5]){2,60}$/,
        checkBank: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,60}$/,
        checkRegistrationAuthority: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,60}$/,
        checkLocation: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,100}$/,
        checkBusinessScope: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,200}$/,
        checkRegistrationStatus: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,60}$/,
        checkRules: {
          companyName: [{validator: checkCompanyName_, trigger: 'blur'}],
          bank: [{validator: checkBank_, trigger: 'blur'}],
          companyAccount: [{validator: checkAccount_, trigger: 'blur'}],
          registerTelephone: [{validator: checkPhone_, trigger: 'blur'}],
          registrationAuthority: [{validator: checkRegistrationAuthority_, trigger: 'blur'}],
          unifiedSocialCreditCode: [{validator: checkCode_, trigger: 'blur'}],
          registeredCapital: [{validator: checkRegisteredCapital_, trigger: 'blur'}],
          approvalDate: [{validator: approvalDate_, trigger: 'blur'}],
          location: [{validator: location_, trigger: 'blur'}],
          businessScope: [{validator: businessScope_, trigger: 'blur'}],
          registrationStatus: [{validator: registrationStatus_, trigger: 'blur'}],
          establishmentDate: [{validator: establishmentDate_, trigger: 'blur'}],
          legalRepresentative: [{validator: checklegalRepresentative_, trigger: 'blur'}],
          registerLocation: [{validator: registerLocation_, trigger: 'blur'}]

        }

      }
    },
    methods: {
      beforeAvatarUpload(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'jpg' || testmsg === 'JPG';
        const extension2 = testmsg === 'png' || testmsg === 'PNG';
        const extension3 = testmsg === 'gif' || testmsg === 'GIF';
        const extension4 = testmsg === 'bmp' || testmsg === 'BMP';

        const isLt2M = file.size / 1024 / 1024;
        if (!extension && !extension2 && !extension3 && !extension4) {
          this.$message({
            message: '上传文件只能是jpg/png/gif/bmp格式!请核实文件列表再次上传',
            type: 'warning'
          });
          this.iscommit = false;
          this.formData = new FormData();
        }
        if (isLt2M > 2) {
          this.$message({
            message: '上传文件大小不能超过 2MB!',
            type: 'warning'
          });
          this.iscommit = false;
          this.formData = new FormData();
        }
        if ((extension || extension2 || extension3 || extension4) && (isLt2M < 2)) {
          this.iscommit = true && this.iscommit;
        }
        // return (extension || extension2 || extension3) && (isLt2M < 2)
      },
      clickNature(e) {
        Number(e) === this.company.corporateNature ? this.company.corporateNature = '' : this.company.corporateNature = e

      },
      clickOffice(e) {
        Number(e) === this.company.headOfficeFlag ? this.company.headOfficeFlag = '' : this.company.headOfficeFlag = e
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
      },
      handleChange(file, fileList) {
        console.log(fileList);
      },
      beforeUpload(file) {
        console.log(file.type);
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isBmp = file.type === 'image/bmp';
        if (!isBmp && !isJPG && !isPng) {
          this.$message.error("格式只能是jpg,png,bmp类型!");
        }
        return isPng || isPng || isBmp
      },
      //覆盖默认上传事件
      uploadLicenses(file) {
        // this.company.businessLicenses = file.file;
        console.log(file.file);
        this.formData.append("businessLicenses", file.file);

      },
      checkFiles() {

      },
      handleOnExceed(files, fileList) {
        this.$message.error("超出文件最大上限个数");
      },
      save() {
        let isValid = false;
        this.$refs['form'].validate((valid) => {
          if (valid) isValid = true;
        });
        let checkFileType = false;
        if (isValid) {
          this.submitUpload();
          if (this.iscommit) {
            this.formData.append("company", JSON.stringify(this.company));
            addCompany(this.formData).then((result) => {
              this.formData = new FormData();
              this.$message.success("新增成功!");
              this.$refs['upload'].clearFiles();
              this.$store.dispatch('tagsView/delVisitedView', this.$route);
              this.$router.go(-1);
            }).catch(() => {
              this.formData = new FormData();
            });
          } else {
            //点击重新上传
            this.iscommit = true;
            this.formData = new FormData();
          }
        }
      },
      cancel() {
        this.$router.go(-1);
      }
    },
    watch: {
      'company.endBusinessTerm': {
        deep: true,
        handler(val) {
          if (val != null && this.company.startBusinessTerm > val) {
            this.$message.warning("结束时间应大于开始时间!");
            this.company.endBusinessTerm = null;
          }
        }
      },
      'company.startBusinessTerm':{
        deep:true,
        handler(val){
          if(val!= null ){
            if(this.company.endBusinessTerm!=null && this.company.endBusinessTerm<val){
              this.$message.warning("开始时间不能大于结束时间!");
              this.company.startBusinessTerm = null;

            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .actions {
    margin-left: 70%;
    padding-top: 20px;
  }

  .form-container {
    padding-left: 10%;
    .container-title {
      font-size: 23px;
      font-weight: bolder;
    }
    .row {
      margin-top: 10px;
    }
    .form-item {
      .must-need {
        color: red;
      }
      .base-info {
        padding: 10px;
      }
    }
  }
</style>
