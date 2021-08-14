<!--
 * @Author: your name
 * @Date: 2021-05-25 15:01:12
 * @LastEditTime: 2021-05-27 15:00:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \20210426-vue\project\src\components\Form.vue
-->
<template>
  <div>
    <el-time-select
    placeholder="起始时间"
    v-model="startTime"
    :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      maxTime:endTime
    }">
  </el-time-select>
  <el-time-select
    placeholder="结束时间"
    v-model="endTime"
    :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      minTime: startTime
    }">
  </el-time-select>
  </div>
</template>

<script>
export default {
  name: 'VueForm',
  data() {
    return {
        startTime: '',
        endTime: ''
      };
  },
  mounted() {
    
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>

</style>