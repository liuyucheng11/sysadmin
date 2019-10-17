<template>
  <div>
  <el-tree :load="loadNode"
           lazy
           :props="defaultProps"
           :expand-on-click-node="false"
           ref="tree"
           style="margin-top: 1rem">
          <span slot-scope="{ node, data }">
            <el-radio @click.native.prevent="myClick(node,data)" v-model="selectId" :label=data.id  ><span v-bind:class="{invalid:!data.status}"> {{node.label}} </span> </el-radio>
          </span>
  </el-tree>
  </div>
</template>

<script>
  import {cityApi} from "@/api/city";

  export default {
    name: "cityTree",
    data() {
      return {
        cityList: [],
        defaultProps: {
          children: 'children',
          label: 'cnName',
          isLeaf: 'leaf'
        },
        selectId: null,
        obj: '',
        currentNode: '',
        rootNode: ''
      }
    },
    watch: {
      selectId(val) {
          let param = {
            id:val,
            data: this.obj
          }
          this.$emit('select', param)
        }
    },
    mounted() {
      this.currentNode = this.rootNode
    },
    methods: {
      myClick(node, val){
        if(val.id === this.selectId){  //双击取消radio的选中
          this.selectId = ""
          this.obj = ""
          this.currentNode = this.rootNode

        }else{
          this.selectId = val.id
          this.obj = val
          this.currentNode = node
        }

        if(node.parent.data != undefined) {
          this.obj.parentName = node.parent.data.cnName
        }
        //console.log(this.currentNode)

      },
      loadNode(node, resolve){
        if(node.level === 0){
          cityApi.getCityByParent(-1).then((res)=>{
              return resolve(res.data)
          })
          this.rootNode = node
        }
        if(node.level === 2){
          cityApi.getCityByParent(node.data.id).then((res)=>{
            //console.log(res.data)
            let objs = res.data
              for(let i = 0; i< objs.length; i++){
                objs[i].leaf=true;
              }
              return resolve(res.data)
          })
        }
        if(node.level > 0 && node.level < 2){
          cityApi.getCityByParent(node.data.id).then(res=>{
            return resolve(res.data)
          })
        }


      },
      addNode(val) {
        if(val){
          if( val.level == 3 ){
              val.leaf = true
          }
          val = JSON.parse(JSON.stringify(val))      //对象深拷贝，防止对象值错乱
          //this.currentNode.childNodes = []
          let arr = []
          arr.push(val)
          this.currentNode.doCreateChildren(arr)
        }
      },
      updateNode(data) {
       this.currentNode.data = JSON.parse(JSON.stringify(data))      //对象深拷贝，防止对象值错乱
      }
    }
  }
</script>

<style scoped>
  .invalid {
    color: red;
  }

</style>
