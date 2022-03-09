<template>
  <div>
    <div class="container">
      <van-field name="radio" label="单选框">
        <template #input>
          <van-radio-group v-model="radio" direction="horizontal">
            <van-radio name="1">单选框 1</van-radio>
            <van-radio name="2">单选框 2</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Form, Field, Button } from 'vant'
import 'vant/lib/index.css'
import * as api from '../../api/api'
Vue.use(Form).use(Field).use(Button)
export default {
  name: '',
  data() {
    return {}
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped type="text/scss"></style>
