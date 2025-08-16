<script lang="ts">
import sidebar from '../components/panel_sidebar.vue'
import topbar from '../components/panel_topbar.vue'
import foot from '../components/panel_foot.vue'

export default {
  name: 'VERTICAL',
  components: {
    sidebar,
    topbar,
    foot
  }
}
</script>

<template>
    <sidebar />
    <topbar />
    <!-- [ Main Content ] start -->
    <div class="pc-container">
      <div class="pc-content">
        <slot />
      </div>
    </div>
    <!-- [ Main Content ] end -->
    <foot/>
</template>
