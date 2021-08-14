<!--
 * @Author: your name
 * @Date: 2021-04-26 10:44:26
 * @LastEditTime: 2021-05-27 14:59:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \20210426-vue\project\src\components\HelloWorld.vue
-->
<template>
  <div class="hello">
    <div>{{ total }}</div>
    <div> {{  obj.arr[1] }} </div>
    <div>  {{ arrUser[0].name }} </div>
    <button @click="changeTotal">点击</button>
    <div>{{ arrAge[0] }}</div>
    <div>{{ ageTotal }}</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data (){
    return {
      obj:{
        arr:[1,2]
      },
      arrUser:[
        { name:'张三' }
      ],
      arrAge:[12,34]
    }
  },
  computed:{
    total:function(){
     return this.obj.arr.reduce((cur,cer)=>{
       return cur+= cer
      },0)
    },
    ageTotal:function(){
      return this.arrAge.reduce((cur,cer)=>{
       return cur+= cer
      },0)
    }
  },
  methods: {
    changeTotal() {
      this.obj.arr[1] = 9
      this.arrUser[0].name = '李四'
      this.arrAge[0] = 66
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
