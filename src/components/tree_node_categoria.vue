<template>
  <div class="accordion-item">
    <h2 class="accordion-header" :id="'heading' + node.id">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + node.id" aria-expanded="false" :aria-controls="'collapse' + node.id">
        {{ node.nombre }}
      </button>
    </h2>
    <div :id="'collapse' + node.id" class="accordion-collapse collapse" :aria-labelledby="'heading' + node.id" data-bs-parent="#acordionCategorias">
      <div class="accordion-body">
        <ul v-if="node.subcategorias.length > 0">
          <TreeNodeCategoria 
            v-for="subcategoria in node.subcategorias" 
            :key="subcategoria.id" 
            :node="subcategoria" 
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface CategoryNode {
  id: number;
  nombre: string;
  categoriaPadreId: number | null;
  subcategorias: CategoryNode[];
}

// Definir las propiedades que el componente recibirá del padre
const props = defineProps<{ node: CategoryNode }>();
</script>

<style scoped>
.accordion-button {
  cursor: pointer;
}
</style>
