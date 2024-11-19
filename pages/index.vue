<template>
  <div>
    <h1 class="mt-5">Liste des Communes et Qualité de l'Air</h1>
    <CommuneList />
  </div>
</template>

<script setup>
import CommuneList from '~/components/CommuneList.vue';
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
