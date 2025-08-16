<template>
    <div class="offer-card" v-for="oferta in listaCitas" :key="oferta.id">
        <!-- <img :src="oferta.imagenUrl" alt="Offer Image" class="offer-img"> -->
        <div class="offer-details">
            <h3 class="offer-title">{{ oferta.estado }}</h3>
            <!-- <p class="offer-description" v-html="oferta.descripcion"></p> -->
            <div class="offer-info">
                <!-- <span>{{ oferta.valordscto_cliente }}% off</span> -->
                <span>{{ oferta.nro_cons }} cupos</span>
            </div>
            <div class="offer-price">{{ oferta.nombre_paciente }}%</div>
        </div>
        <button class="add-button">+</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useCitas } from '../composables/useCitas'

export default defineComponent({
    setup () {
        const { listaCitas, Listar_Citas } = useCitas();

        onMounted(async () => {
            await Listar_Citas();
        });

        return {
            listaCitas
        }
    }
})
</script>

<style scoped>
.offer-card {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 10px 0;
    position: relative;
}

.offer-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
}

.offer-details {
    flex: 1;
}

.offer-title {
    font-size: 1.2em;
    margin: 0;
}

.offer-description {
    color: #666;
    margin: 10px 0;
}

.offer-info {
    display: flex;
    gap: 10px;
    color: #999;
}

.offer-price {
    font-size: 1.5em;
    color: #333;
    margin-top: 10px;
}

.add-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background-color: #00bcd4;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.add-button:hover {
    background-color: #0097a7;
}
</style>