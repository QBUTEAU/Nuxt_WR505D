<template>
  <div>
    <!-- Passer le nom de la commune en prop à CommuneDetails -->
    <CommuneDetails :communeName="communeName" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommuneDetails from '~/components/CommuneDetails.vue';

// Récupérer les paramètres de la route
const route = useRoute();

// Extraire le nom de la commune depuis les paramètres de la route
const communeName = route.params.commune; // Utilisation du nom de la commune dans l'URL
</script>
