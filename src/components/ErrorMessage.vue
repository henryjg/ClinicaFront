<template>
    <div v-if="error" class="text-danger f-12 text-inter px-2">
      <i class="fa fa-asterisk" style="font-size: 0.4rem;"></i> {{ error }}
    </div>
</template>
  
<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      error: {
        type: String,
        required: false
      }
    }
  });
</script>
