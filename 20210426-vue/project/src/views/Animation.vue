<!--
 * @Author: 九天
 * @Date: 2021-07-20 14:22:30
 * @LastEditors: 九天
 * @LastEditTime: 2021-07-20 14:32:14
 * @Description: 
 * @FilePath: \project\src\views\Animation.vue
-->
<template>
  <ul class="flex">
    <ScrollNum
      v-for="(num, idx) of numArr"
      :key="idx"
      as="li"
      :i="num"
      :delay="idx + 1"
    />
  </ul>
</template>

<script>
import ScrollNum from '../components/ScrollNum'

export default {
  name: 'App',
  components: { ScrollNum },
  data: () => ({ num: 886 }),
  computed: {
    numArr () {
      const str = String(this.num)

      return [parseInt(str[0]), parseInt(str[1]), parseInt(str[2])]
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>