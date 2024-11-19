<template>
  <div>
    <CommuneDetails :communeName="communeName" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommuneDetails from '~/components/CommuneDetails.vue';

const route = useRoute();
const communeName = route.params.commune; // Le nom de la commune est dans les paramètres de la route
</script>
