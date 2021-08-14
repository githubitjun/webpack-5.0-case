<!--
 * @Author: 九天
 * @Date: 2021-07-20 16:13:07
 * @LastEditors: 九天
 * @LastEditTime: 2021-07-20 16:55:55
 * @Description: 
 * @FilePath: \project\src\views\Monitor.vue
-->
<template>
  <div>
    <input type="text" v-model="params.a" />
    <input type="text" v-model="params.b" />
    <input type="text" v-model="params.c" />
    <input type="text" v-model="params.d" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      property: "value",
      params: {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      },
    };
  },
  mounted() {
    // 实现对对象的部分属性进行监听
    Object.keys(this.params)
      .filter((_) => !["c", "d"].includes(_)) // 排除对c，d属性的监听
      .forEach((_) => {
        this.$watch(
          (vm) => vm.params[_],
          () => {
            // 改变后的执行函数
            console.log("这是这里改变了");
          },
          {
            deep: true,
          }
        );
      });
  },
  methods: {
    fn() {
      let timeId = setInterval(() => {
        console.log("1111");
      }, 1000);
      this.$once("hook:beforeDestory", function() {
        clearInterval(timeId);
      });
    },
  },
  watch: {
    //   params:{
    //       deep:true,
    //       handler(){
    //           console.log('改变了');
    //       }
    //   }
  },
};
</script>

<style></style>
