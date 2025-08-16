<template>
  <div class="accordion accordion-flush" id="acordionCategorias">
    <TreeNodeCategoria 
      v-for="category in categories" 
      :key="category.id" 
      :node="category" 
    />
  </div>
</template>

<script lang="ts" setup>
import TreeNodeCategoria from './tree_node_categoria.vue';

interface CategoryNode {
  id: number;
  nombre: string;
  categoriaPadreId: number | null;
  subcategorias: CategoryNode[];
}

// Definir las propiedades que el componente recibirá del padre
const props = defineProps<{ categories: CategoryNode[] }>();
</script>

<style scoped>
.accordion {
  margin-top: 20px;
}
</style>
