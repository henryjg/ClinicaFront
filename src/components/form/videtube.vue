<template>
    <div class="video-container">
      <iframe
        :src="videoUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'YouTubePlayer',
    props: {
      videoId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      // Genera la URL del video de YouTube con el ID recibido
      const videoUrl = computed(() => `https://www.youtube.com/embed/${props.videoId}?controls=1&rel=0&modestbranding=1&showinfo=0&fs=0`);
  
      return {
        videoUrl
      };
    }
  });
  </script>
  
  <style scoped>
  .video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* Aspect ratio de 9:16 para formato vertical */
    height: 0;
    overflow: hidden;
  }
  
  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  </style>
  