<template>
  <div>
    <select ref="choiceSelect" v-model="internalValue" class="form-control" data-trigger></select>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, defineComponent, nextTick } from 'vue';
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';

export default defineComponent({
  name: 'ChoiceSelect',
  props: {
    modelValue: {
      type: [String, Number],
      required: false,
      default: null
    },
    options: {
      type: Array as () => Array<{ [key: string]: any }>,
      required: true
    },
    valueField: {
      type: String,
      required: true
    },
    labelField: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const choiceSelect = ref<HTMLSelectElement | null>(null);
    const internalValue = ref(props.modelValue);
    let choicesInstance: Choices | null = null;

    const initChoices = async () => {
      // Asegurarse de que el DOM esté completamente actualizado antes de iniciar Choices
      await nextTick();

      // Verificar que el ref de choiceSelect esté definido
      if (!choiceSelect.value) {
        console.error('No se pudo encontrar el elemento <select>.');
        return;
      }

      // Destruir la instancia anterior de Choices para evitar duplicados
      if (choicesInstance) {
        choicesInstance.destroy();
      }

      // Crear una nueva instancia de Choices
      choicesInstance = new Choices(choiceSelect.value, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        position: 'bottom',
        choices: [
          { value: '', label: 'Seleccionar...', disabled: true, selected: true }, // Opción por defecto
          ...props.options.map((option) => ({
            value: option[props.valueField],
            label: option[props.labelField]
          }))
        ]
      });

      // Sincronizar v-model con Choices
      if (internalValue.value !== null) {
        choicesInstance.setChoiceByValue(internalValue.value.toString());
      }

      // Añadir el listener de cambio
      choicesInstance.passedElement.element.addEventListener('change', handleChange);
    };

    const handleChange = (event: Event) => {
      const selectedValue = (event.target as HTMLSelectElement).value;
      emit('update:modelValue', selectedValue);
    };

    // Reactivar Choices cuando se cambian las opciones
    watch(() => [props.options, props.valueField, props.labelField], () => {
      initChoices();
    }, { immediate: true });

    // Sincronizar cambios externos en modelValue con el selector
    // En tu componente ChoiceSelect.vue, modifica o agrega el siguiente watch
    watch(() => props.modelValue, (newValue) => {
      internalValue.value = newValue;
      if (choicesInstance) {
        // Actualizar el valor en Choices si existe y el nuevo valor no es nulo
        choicesInstance.setChoiceByValue(newValue ? newValue.toString() : '');
      }
    }, { immediate: true });


    onMounted(() => {
      initChoices();
    });

    onBeforeUnmount(() => {
      if (choicesInstance) {
        choicesInstance.destroy();
      }
    });

    return {
      choiceSelect,
      internalValue
    };
  }
});
</script>

<style scoped>
/* Estilos personalizados */
</style>
