<template>
  <div>
    <el-dialog
      title="版块创建"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :before-close="hide"
    >
      <el-form :model="form">
        <el-form-item label="版块名称:">
          <el-input v-model="form.submitForum" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="申请原因:">
          <el-input
            v-model="form.submitForumReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="applyForum()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '../../api/api'
import { createArticle } from '../../api/article'
export default {
  name: 'ApplyForum',
  data() {
    return {
      // dialogTableVisible: false,
      form: {
        submitForum: '',
        submitForumReason: '',
      },
      show: false,
    }
  },
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    // this.show = this.dialogTableVisible
  },

  methods: {
    hide() {
      this.$emit('hideFunc')
    },
    applyForum() {
      api
        .applyForum({
          name: this.form.submitForum,
          reason: this.form.submitForumReason,
        })
        .then((res) => {
          if (res.success) {
            this.$toast('申请提交成功，请等待审批通知')
            this.$emit('hideFunc')
            // this.getForumInfo()
          }
        })
    },
  },
}
</script>

<style scoped></style>
