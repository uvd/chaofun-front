<template>
  <div
    id="container"
    class="dashboard-container container infinite-list"
    ref="container"
    :style="{ height: scrollHeight + 'px' }"
  >
    <div>
      <div style="height: 50px"></div>
      <div class="main_content">
        <div v-if="!ISPHONE" class="main_left"></div>
        <div class="main_center">
          <div
            class="grid-content"
            style="
              overflow: auto;
              width: 640px;
              max-width: 100%;
              margin: 0 auto;
            "
          >
            <fbi />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fbi from '@/views/chaofun-webview/fbi/fbi.vue'
export default {
  components: {
    fbi,
  },
  mounted() {
    document.title = '饭币（FBi）'
  },
}
</script>
