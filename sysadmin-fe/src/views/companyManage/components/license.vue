<template>
  <div>
    <div class="license-info">
      <div class="license-img">
        <img :src="fileUrl+license.id" height="150px" width="200px"/>
      </div>
      <div class="actions">
        <el-button type="danger" @click="deleteLicense" size="small" v-if="!onlyShow">删除此附件</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  import {fileUrl} from '../../../api/company';

  export default {
    name: "license",
    props: ['license','onlyShow'],
    data() {
      return {
        licenseUrl: '',
        fileUrl: fileUrl
      }
    },
    methods: {
      deleteLicense() {
        this.$emit('delete-license', this.license.id);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .license-info {
    margin: 5px;
    float: left;
    width: 205px;
    height:190px;
    border-radius:3px;
    border: 2px solid #27b7c0;
    .license-img {
    }
    .actions {
        padding-left:50px ;
    }
  }

</style>
