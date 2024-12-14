<template>
  <div class="container mt-4 mb-5">
    <input
      type="text"
      v-model="search"
      class="form-control"
      placeholder="Rechercher une commune"
    />

    <!-- Grille des communes avec pagination -->
    <div class="row mt-5">
      <div
        v-for="(commune, index) in displayedCommunes"
        :key="commune.code"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ commune.nom }}</h5>

            <p><strong>Code Postal :</strong> 
              {{ commune.codesPostaux.length > 1 ? commune.codesPostaux[0] : commune.codesPostaux.join(', ') }}
            </p>

            <NuxtLink :to="`/communes/${commune.nom}`" class="btn btn-primary">
              Voir les détails
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton Voir plus uniquement si la pagination est activée -->
    <div class="text-center mt-4 mb-5" v-if="displayedCommunes.length < filteredCommunes.length">
      <button
        @click="loadMore"
        class="btn btn-primary"
      >
        Voir plus
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

const search = ref('');
const communes = ref([]);
const currentPage = ref(1);
const itemsPerPage = 20; // Nombre d'éléments à afficher par page
const displayedCommunes = ref([]);

onMounted(async () => {
  const { data } = await axios.get('https://geo.api.gouv.fr/communes?fields=nom,code,codeRegion,codeEpci,siren,codesPostaux&format=json&geometry=centre');
  communes.value = data;
  loadMore(); // Charger les premières communes dès le début
});

const filteredCommunes = computed(() => {
  return communes.value.filter((commune) =>
    commune.nom.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Charger plus d'éléments (pagination)
const loadMore = () => {
  const start = currentPage.value * itemsPerPage;
  const end = (currentPage.value + 1) * itemsPerPage;
  displayedCommunes.value = [
    ...displayedCommunes.value,
    ...filteredCommunes.value.slice(start, end),
  ];
  currentPage.value++;
};

// Réinitialiser la liste des communes affichées lors de la recherche
watch(search, () => {
  currentPage.value = 1;
  if (search.value) {
    if (filteredCommunes.value.length > itemsPerPage) {
      displayedCommunes.value = filteredCommunes.value.slice(0, itemsPerPage); // Affiche les résultats de recherche avec pagination
    } else {
      displayedCommunes.value = filteredCommunes.value; // Affiche tous les résultats de recherche sans pagination
    }
  } else {
    displayedCommunes.value = filteredCommunes.value.slice(0, itemsPerPage); // Affiche les résultats avec pagination
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.card {
  height: 100%;
}

.card-title {
  font-size: 18px;
}

.btn {
  width: 100%;
}
</style>