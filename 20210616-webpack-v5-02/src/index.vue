<!--
 * @Author: 九天
 * @Date: 2021-06-17 16:27:17
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-17 17:43:07
 * @Description: 
 * @FilePath: \20210616-webpack-v5-02\src\index.vue
-->
<template>
  <div>
    <div class="example">{{ msg }}</div>
    <button @click="msg +=1">点击</button>
  </div>
</template>

<script>
console.log('vue 文件');
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>