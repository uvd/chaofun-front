<template>
  <div>
    <div v-if="ISPHONE && datas.dialogVisible" class="covers">
      <div class="content">
        <div style="padding: 20px 14px 40px; font-size: 16px">转发</div>
        <el-form label-position="right" label-width="70px" :model="addForm">
          <el-form-item class="hl-titel" label="源标题">
            <el-input
              type="textarea"
              disabled
              placeholder="请输入分享标题"
              :model-value="datas.data.sourceTitle"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item class="hl-titel" label="分享到">
            <el-select
              v-model="addForm.targetForumId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="changes"
              @change="toOpen"
              @focus="getForum('')"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.link"
                :label="item.title"
                :value="item.link"
                ><img class="sicon" :src="imgOrigin + item.icon" alt="" />
                <span>{{ item.title }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="hl-titel" label="标题">
            <el-input
              type="textarea"
              placeholder="请输入分享标题"
              v-model="addForm.title"
              resize="none"
            ></el-input>
          </el-form-item>
          <div style="margin-top: 50px; text-align: center">
            <el-button @click="datas.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSub">确 定</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="转发"
      :visible.sync="!ISPHONE && datas.dialogVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose"
    >
      <div>
        <el-form label-position="right" label-width="70px" :model="addForm">
          <el-form-item class="hl-titel" label="源标题">
            <el-input
              type="textarea"
              disabled
              placeholder="请输入分享标题"
              :model-value="datas.data.sourceTitle"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item class="hl-titel" label="分享到">
            <el-select
              v-model="addForm.targetForumId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="changes"
              @change="toOpen"
              @focus="getForum('')"
              @blur="blurs"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.link"
                :label="item.title"
                :value="item.link"
                ><img class="sicon" :src="imgOrigin + item.icon" alt="" />
                <span>{{ item.title }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="hl-titel" label="标题">
            <el-input
              type="textarea"
              v-model="addForm.title"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="datas.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSub">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="!ISPHONE && datas.dialogVisible" class="fixed_model"></div>
  </div>
</template>

<script>
import * as api from '../../api/api'
export default {
  name: '',
  data() {
    return {
      addForm: {
        targetForumId: '',
      },
      options: [],
      loading: false,
      targetForumId: '',
    }
  },
  props: {
    datas: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {},
  created() {},
  mounted() {
    this.getForum()
  },
  methods: {
    getForum(keyword) {
      api.searchForum({ keyword }).then((res) => {
        this.options = res.data
        // if(keyword){
        //     this.addForm.targetForumId = this.options[0].link
        // }
      })
    },
    blurs(v) {
      console.log(v)
      let bool = false
      if (this.addForm.targetForumId) {
        this.options.forEach((item) => {
          if (this.addForm.targetForumId == item.title) {
            this.addForm.targetForumId = item.link
            bool = true
          }
        })
        if (!bool) {
          this.addForm.targetForumId = this.options.length
            ? this.options[0].link
            : ''
        }
      }
    },
    toOpen(v) {
      console.log(v)
      this.$set(this.addForm, 'targetForumId', v)
    },
    changes(v) {
      //   this.getForum(v?v:'')
      console.log(v)
      this.getForum(v ? v : '')
      this.addForm.targetForumId = v
    },
    onSub() {
      let params = {
        sourcePostId: this.datas.data.sourcePostId,
        targetForumId: this.addForm.targetForumId.split('/')[2],
        title: this.addForm.title,
      }
      if (params.title && this.addForm.targetForumId) {
        api.submitForward(params).then((res) => {
          this.$message.success('转发成功')
          setTimeout(() => {
            // this.$router.push({path: this.addForm.targetForumId})
            this.datas.dialogVisible = false
            let routeData = this.$router.resolve({
              path: this.addForm.targetForumId,
            })
            window.open(routeData.href, '_blank')
          }, 1500)
        })
      } else {
        this.$message.error('请填写完整')
      }
      console.log(params)
    },
    handleClose() {
      this.datas.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
/deep/ .el-dialog {
  z-index: 2002;
  height: 400px !important;
  margin-top: -10% !important;
}
/deep/ .el-dialog .el-dialog__body .el-form-item {
  margin-bottom: 20px;
}
/deep/ .el-dialog__wrapper {
  // height: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
/deep/ .el-dialog__header {
  padding: 20px 20px 10px !important;
}
/deep/ .el-dialog__body {
  padding: 30px 20px !important;
}
/deep/ .el-dialog__footer {
  padding: 10px 20px 40px !important;
  text-align: right;
}
.fixed_model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}
.sicon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 4px;
}

.covers {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  z-index: 10;
  .content {
    width: 340px;
    background: #fff;
    height: 380px;
    border-radius: 4px;
    margin-top: 24%;
  }
}
/deep/ .el-form-item {
  margin-bottom: 20px !important;
}
</style>
