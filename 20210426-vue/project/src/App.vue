<!--
 * @Author: 九天
 * @Date: 2021-04-26 10:44:26
 * @LastEditors: 九天
 * @LastEditTime: 2021-08-11 10:08:08
 * @Description: 
 * @FilePath: \20210426-vue\project\src\App.vue
-->
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <router-link to="/animation">Animation</router-link> |
      <router-link to="/monitor">Monitor</router-link> |
      <router-link to="/uploadFiles">UploadFiles</router-link> |
      <router-link to="/breakUpload">BreakUpload</router-link> |
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
