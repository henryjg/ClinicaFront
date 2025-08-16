<template>
  <div>
    <select ref="ubigeoSelect" v-model="selectedUbigeo" class="form-control f-8" data-trigger></select>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, defineComponent } from 'vue';
import Choices from 'choices.js';
import { useUbigeo } from '../composables/useUbigeo';

export default defineComponent({
  name: 'UbigeoSelect',
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { listarUbigeos } = useUbigeo();
    const ubigeoSelect = ref<HTMLSelectElement | null>(null);
    const selectedUbigeo = ref<number | null>(props.modelValue);
    let choicesInstance: Choices | null = null;

    const initChoices = async () => {
      try {
        const response = await listarUbigeos();
        choicesInstance = new Choices(ubigeoSelect.value as HTMLSelectElement, {
          searchEnabled: true,
          itemSelectText: '',
          shouldSort: false,
          position: "bottom",
          choices: response.data.map((ubigeo: { id: number, ubigeo: string }) => ({
            value: ubigeo.id,
            label: ubigeo.ubigeo
          }))
        });
      } catch (error) {
        console.error('Error fetching ubigeos:', error);
      }
    };    onMounted(() => {
      initChoices();
    });

    onBeforeUnmount(() => {
      if (choicesInstance) {
        choicesInstance.destroy();
      }
    });

    // Observa cambios en selectedUbigeo y emite el valor actualizado
    watch(selectedUbigeo, (newValue) => {
      emit('update:modelValue', newValue);
    });

    // Observa cambios en modelValue (desde el padre) para actualizar selectedUbigeo
    watch(() => props.modelValue, (newValue) => {
      selectedUbigeo.value = newValue;
    });

    return {
      ubigeoSelect,
      selectedUbigeo
    };
  }
});
</script>

<style>
/* Puedes agregar estilos personalizados aquí si lo necesitas */
</style>
