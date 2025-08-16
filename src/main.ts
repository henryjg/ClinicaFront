import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import Vue3Lottie from 'vue3-lottie'

import 'bootstrap';
// Import Bootstrap and its dependencies
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import 'bootstrap/dist/js/bootstrap.bundle';

import 'simplebar-vue/dist/simplebar.min.css';
// Import your custom styles and scripts
import '@/assets/main.css';
import '@/assets/fonts/tabler-icons.min.css';
import '@/assets/fonts/feather.css';
import '@/assets/fonts/fontawesome.css';
import '@/assets/fonts/material.css';
import '@/assets/css/style.css';
import '@/assets/css/hover.css';

import '@/assets/css/style-preset.css';

import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'


// import '@/assets/css/landing.css';


import 'nprogress/nprogress.css';

import 'vue-toastification/dist/index.css';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(Toast);
app.use(head);
app.use(Vue3Lottie);
app.use(VueApexCharts);
app.use(router);

app.mount('#app');


