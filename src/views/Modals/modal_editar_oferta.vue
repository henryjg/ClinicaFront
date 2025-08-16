<script lang="ts">
import { defineComponent, ref, PropType, watch, onMounted } from 'vue';
import NProgress from 'nprogress';
import { QuillEditor } from '@vueup/vue-quill'
import BlotFormatter from 'quill-blot-formatter'
import { Modal } from 'bootstrap';
import { Alerta } from '../../utils/_utils';
import { useCategorias, useNegocios, Sunat } from '../../composables/_composables';
import type { Negocio } from '../../interfaces/_interface';

export default defineComponent({
  components:{
    QuillEditor
  },
  name: 'ModalEditNegocio',
  props: {
    negocio: {
      type: Object as PropType<Negocio>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const localNegocio = ref<Negocio>({ ...props.negocio });
    const { Validar_RUC, Validar_DNI, PersonaData, EmpresaData } = Sunat();
    const isLoadingRuc = ref(false);
    const isLoadingDni = ref(false);
    const { Listar_Categorias, listaCategorias } = useCategorias();
    const { Actualizar_Negocio } = useNegocios();

    const editorDescripcion = ref(localNegocio.value.descripcion);
    const campoedit = ref('');

    onMounted(async () => {
      await Listar_Categorias();
    });

    const validate = () => {
      if (!localNegocio.value.ruc || !localNegocio.value.razonSocial || !localNegocio.value.nombreComercial) {
        Alerta.Error('Error', 'Por favor, complete todos los campos obligatorios.');
        return false;
      }
      return true;
    };
    
    const modules = {
      name: 'blotFormatter',
      module: BlotFormatter,
      options: {},
    };

    const load_htmlcontent = (campo: string, valor: string) => {
      editorDescripcion.value = valor;
      campoedit.value = campo;
    };

    const GuardaCambios = async () => {
      localNegocio.value.descripcion = editorDescripcion.value;
      if (!validate()) return;

      try {
        // Usar la función del composable
        const resultado = await Actualizar_Negocio(localNegocio.value.id, localNegocio.value);
        
        if (resultado) {
          Alerta.Sucessfull('Guardado', 'El negocio se ha actualizado correctamente.');
          emit('updated');
          closeModal();
        }
      } catch (error) {
        console.error('Error al guardar negocio:', error);
        Alerta.Error('Error', 'Error desconocido al guardar el negocio');
      }
    };

    const closeModal = () => {
      const modalElement = document.getElementById('edit_NegocioModal');
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };

    const validarDNI = async () => {
      isLoadingDni.value = true;
      try {
        const Respuesta = await Validar_DNI(localNegocio.value.dniRepresentante);
        if (Respuesta) {
          PersonaData.value = Respuesta;
          localNegocio.value.nombreRep = `${PersonaData.value.nombres} ${PersonaData.value.apellidoPaterno} ${PersonaData.value.apellidoMaterno}`;
        }
      } finally {
        isLoadingDni.value = false;
      }
    };

    const onRucChange = async () => {
      if (localNegocio.value.ruc.length !== 11) return;
      
      isLoadingRuc.value = true;
      try {
        NProgress.start();
        const Respuesta = await Validar_RUC(localNegocio.value.ruc);
        if (Respuesta) {
          EmpresaData.value = Respuesta;
          localNegocio.value.razonSocial = EmpresaData.value.razonSocial;
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del negocio.');
      } finally {
        isLoadingRuc.value = false;
        NProgress.done();
      }
    };

    watch(() => props.negocio, (newNegocio) => {
      localNegocio.value = { ...newNegocio };
      editorDescripcion.value = localNegocio.value.descripcion;
    });

    return {
      localNegocio,
      GuardaCambios,
      closeModal,
      validarDNI,
      onRucChange,
      listaCategorias,
      editorDescripcion,
      modules,
      load_htmlcontent,
      isLoadingDni,
      isLoadingRuc
    };
  },
});
</script>