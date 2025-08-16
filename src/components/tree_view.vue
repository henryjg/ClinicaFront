<!-- TreeView.vue -->
<template>
    <div class="accordion accordion-flush" id="acordionOficinas">
      <TreeNode 
        v-for="office in offices" 
        :key="office.id" 
        :node="office" 
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import TreeNode from './tree_node.vue';
  
  export interface OfficeNode {
    id: number;
    nombre: string;
    padre_id: number | null;
    subOficinas: OfficeNode[];
  }
  
  // Definir las propiedades que el componente recibirá del padre
  const props = defineProps<{ offices: OfficeNode[] }>();
  </script>
  
  <style scoped>
  .accordion {
    margin-top: 20px;
  }
  </style>
  