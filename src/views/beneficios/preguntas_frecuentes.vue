<template>
  <div class="container my-5">
    <p class="mb-4 text-center text-primary f-30 f-w-600">
      <i class="fa fa-question-circle"></i> Preguntas Frecuentes
    </p>
    <div class="accordion" id="accordionPreguntas">
      <div class="accordion-item" v-for="(preg, index) in listaPreguntas" :key="preg.id">
        <h2 class="accordion-header" :id="'heading' + index">
          <button class="accordion-button collapsed f-16 f-w-600" type="button" data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + index" aria-expanded="false" :aria-controls="'collapse' + index">
            <div class="d-flex align-items-center w-100 text-yellow-700">
              <div class="avtar avtar-xs border b-warning bg-light-warning me-2 my-0 py-0" data-bs-toggle="tooltip" data-bs-title="143 Posts">
                  <span>{{ index + 1 }}</span>
              </div>
              {{ preg.pregunta }}
            </div>
          </button>
        </h2>
        <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index"
          data-bs-parent="#accordionPreguntas">
          <div class="accordion-body text-secondary pt-4 pb-5">
            {{ preg.descripcion }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { usePreguntas } from '../../composables/usePreguntas';

export default defineComponent({
  setup() {
    const { listaPreguntas, Listar_Preguntas } = usePreguntas();

    onMounted(() => {
      Listar_Preguntas();
    });

    return {
      listaPreguntas,
    };
  },
});
</script>