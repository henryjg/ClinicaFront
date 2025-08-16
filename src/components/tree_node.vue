<!-- TreeNode.vue -->
<template>
  <div class="accordion-item  my-0">
    <h2 class="accordion-header px-0 py-0" 
        :id="`heading-${node.id}`">
          <button  
            class="accordion-button collapsed  py-2" 
            type="button" 
            @click="toggle" 
            :data-bs-toggle="'collapse'"
            :data-bs-target="`#collapse-${uniqueId}`"
            :aria-expanded="isExpanded ? 'true' : 'false'" 
            :aria-controls="`collapse-${uniqueId}`"
          >
            <!-- Icono de carpeta -->
            <i class="p-r-15 text-yellow-800"
              :class="isExpanded ? 'fa fa-folder-open' : 'fa fa-folder '" 
              style="font-size: 1.2rem;">
            </i>
            {{ node.nombre }}
          </button>
    </h2>
    <div 
      :id="`collapse-${uniqueId}`" 
      class="accordion-collapse collapse"
      :aria-labelledby="`heading-${node.id}`"
    >
      <div class="accordion-body">
        <p v-if="node.subOficinas.length === 0">No hay suboficinas.</p>
        <div v-else>
          <TreeNode 
            v-for="child in node.subOficinas" 
            :key="child.id" 
            :node="child"
          />        
        </div>
        <!-- Botón de eliminar -->
        <button  v-if="node.subOficinas.length === 0"
          class="btn btn-outline-danger btn-sm ms-auto me-2" 
          @click="deleteNode">
          <i class="fa fa-trash"></i> Eliminar
        </button>
      </div>
       
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import TreeNode from './tree_node.vue';

interface OfficeNode {
  id: number;
  nombre: string;
  padre_id: number | null;
  subOficinas: OfficeNode[];
}

const props = defineProps<{ node: OfficeNode }>();

// Estado local para controlar la expansión del acordeón
const isExpanded = ref(false);

// ID único para evitar conflictos en el acordeón
const uniqueId = computed(() => `node-${props.node.id}`);

function toggle() {
  isExpanded.value = !isExpanded.value;
}

function deleteNode() {
  // Lógica para eliminar el nodo
  console.log(`Eliminar oficina con ID: ${props.node.id}`);
  // Aquí se puede emitir un evento o llamar a un servicio de eliminación.
}
</script>

<style scoped>
.accordion-item {
  margin-bottom: 0.5rem;
}
.accordion-header {
  padding: 0.5rem 1rem;
}
</style>
