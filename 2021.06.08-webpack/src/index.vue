<!--
 * @Author: 九天
 * @Date: 2021-06-17 16:27:17
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-17 17:10:58
 * @Description: 
 * @FilePath: \2021.06.08-webpack\src\index.vue
-->
<template>
  <div class="example">{{ msg }}</div>
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