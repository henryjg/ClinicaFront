
<template>
    <form id="jobForm" @submit.prevent="handleSubmit">
       
        <div class="row">
            <div class="col-md-2">
                <div class="chat-avtar d-inline-flex mx-auto">
                    <img class="img-fluid p-3 " src="../assets/images/maker.png" alt="Property image">
                </div>
            </div>
            <div class="col-md-10">
                <div class="row mt-4">
                    <div class="col-sm-12">
                            <label class="form-label text-primary">Dirección:</label>
                            <input type="text" class="form-control" placeholder="Enter City">
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-sm-4">
                        <div class="mb-3">
                            <label class="form-label text-primary">Departamento:</label>
                            <input type="text" class="form-control" placeholder="Enter City">
                        </div>
                    </div>                    <div class="col-sm-4">
                        <div class="mb-3">
                            <label class="form-label text-primary">Latitud:</label>
                            <input type="text" class="form-control" v-model="googleMaps.markerPosition.value.lat" readonly>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="mb-3">
                            <label class="form-label text-primary">Longitud:</label>
                            <input type="text" class="form-control" v-model="googleMaps.markerPosition.value.lng" readonly >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">            <div class="col-md-12">
                <GoogleMap
                    :api-key="GoogleApi"
                    :style="googleMaps.mapConfig.style"
                    :center="googleMaps.center.value"
                    :zoom="googleMaps.mapConfig.zoom"
                    :streetViewControl="googleMaps.mapConfig.streetViewControl"
                    :disable-default-ui="googleMaps.mapConfig.disableDefaultUI"
                    :gestureHandling="googleMaps.mapConfig.gestureHandling"
                >
                    <Marker :options="googleMaps.markerOptions.value" @dragend="googleMaps.updatePosition" />
                </GoogleMap>
            </div>
        </div>
    </form>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { useGoogleMaps } from '../composables/_composables';
import { GoogleApi } from '../config';

export default defineComponent({
  name: 'GoogleMapComponent',
  components: {
    GoogleMap,
    Marker
  },
  setup() {
    const googleMaps = useGoogleMaps();
    
    const handleSubmit = () => {
      const position = googleMaps.markerPosition.value;
      alert(`Latitud: ${position.lat}, Longitud: ${position.lng}`);
    };
    
    return {
      googleMaps,
      GoogleApi,
      handleSubmit,
    };
  },
});
</script>
