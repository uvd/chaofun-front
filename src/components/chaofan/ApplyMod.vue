<template>
  <div>
    <el-dialog
      title="版主申请"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :before-close="hide"
    >
      <el-form :model="form">
        <el-form-item label="申请理由:">
          <el-input v-model="form.applyModReason" autocomplete="off"></el-input>
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
  name: 'ApplyMod',
  data() {
    return {
      // dialogTableVisible: false,
      form: {
        applyModReason: '',
      },
      show: false,
    }
  },
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
    forumId: {
      type: String,
      default: null,
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
        .applyMod({ forumId: this.forumId, reason: this.form.applyModReason })
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
