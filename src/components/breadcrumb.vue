<template>
    <!-- [ breadcrumb ] start -->
    <div class="page-header">
      <div class="page-block">
        <div class="row align-items-center">
          <div class="col-md-12">
            <ul class="breadcrumb">
              <li v-for="(route, index) in links" :key="index" class="breadcrumb-item">
                <router-link :to="route.path" class="pc-link">{{ route.name }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- [ breadcrumb ] end -->
  </template>
  
  <script setup lang="ts">
  export interface Links {
    path: string;
    name: string;
  }
  
  const props = defineProps<{
    links: Links[];
  }>();
  </script>
  
  <style scoped>
  /* Tu estilo aquí */
  </style>
  