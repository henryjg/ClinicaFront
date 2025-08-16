<template>
    <div class="content-container">
        <div v-html="terminosYCondiciones"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { usePagina } from '../../composables/usePagina';

export default defineComponent({
    setup() {
        const { EstaEmpresa, Listar_Pagina } = usePagina();
        const terminosYCondiciones = ref('');

        onMounted(async () => {
            await Listar_Pagina();
            terminosYCondiciones.value = EstaEmpresa.value.terminosycondiciones;
        });

        return {
            terminosYCondiciones
        };
    }
});
</script>

<style scoped>
.content-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}
</style>