<template>
  <div class="container mt-5">
    <!-- Bouton Retour -->
    <NuxtLink to="/" class="btn btn-secondary mb-4">
      ← Retour
    </NuxtLink>

    <!-- Titre principal -->
    <h1 class="mb-4"><span class="text-uppercase">{{ communeName }}</span> ({{ communeDetails.codeDepartement }})</h1>

    <!-- Informations sur la commune -->
    <h2 class="card-title mb-3">Informations de la commune :</h2>
    <div class="card">
      <div class="card-body">
        <!-- Code Postal principal -->
        <p class="card-text"><strong>Code Postal principal :</strong>
          {{ communeDetails.codesPostaux && communeDetails.codesPostaux.length > 0
              ? communeDetails.codesPostaux[0]
              : 'Aucun code postal disponible' }}
        </p>
        <!-- Département -->
        <p class="card-text"><strong>Département :</strong> {{ departmentName }} ({{ communeDetails.codeDepartement }})</p>
        <!-- Région -->
        <p class="card-text mb-3"><strong>Région :</strong> {{ regionName }} ({{ communeDetails.codeRegion }})</p>
        <!-- Population -->
        <p class="card-text mb-3"><strong>Population :</strong> {{ communeDetails.population }} habitants</p>
        <!-- Code INSEE -->
        <p class="card-text"><strong>Code INSEE :</strong> {{ communeDetails.code }}</p>
        <!-- Code EPCI -->
        <p class="card-text"><strong>Code EPCI :</strong> {{ communeDetails.codeEpci }}</p>
        <!-- SIREN -->
        <p class="card-text"><strong>SIREN :</strong> {{ communeDetails.siren }}</p>
      </div>
    </div>

    <!-- Section Qualité de l'air -->
    <div class="mt-4">
      <h2 class="card-title mb-3">Qualité de l'air :</h2>
      <!-- Chargement -->
      <p v-if="!airQuality">La qualité de l'air de cette commune n'a pas été évaluée.</p>
      <!-- Affichage des données -->
      <div v-else class="card">
        <div class="card-body">
          <!-- Indice actuel AQI -->
          <h4 class="card-title">Indice de qualité de l'air (AQI) : {{ airQuality.aqi }}</h4>
          <p><strong>Polluant dominant :</strong> {{ airQuality.dominentpol }}</p>
          <hr />
          <!-- Détails des composants -->
          <h4 class="card-subtitle mb-3">Détails des composants :</h4>
          <ul>
                        <li><strong>Température (°C) :</strong> {{ airQuality.iaqi.t?.v || 'Non disponible' }}</li>
            <li><strong>Ozone (O₃) :</strong> {{ airQuality.iaqi.o3?.v || 'Non disponible' }}</li>
            <li><strong>Dioxyde d'azote (NO₂) :</strong> {{ airQuality.iaqi.no2?.v || 'Non disponible' }}</li>
            <li><strong>Particules fines PM10 :</strong> {{ airQuality.iaqi.pm10?.v || 'Non disponible' }}</li>
            <li><strong>Particules fines PM2.5 :</strong> {{ airQuality.iaqi.pm25?.v || 'Non disponible' }}</li>
            <li><strong>Dioxyde de soufre (SO₂) :</strong> {{ airQuality.iaqi.so2?.v || 'Non disponible' }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Géolocalisation sur la carte -->
    <div class="mt-4">
      <h2>Géolocalisation :</h2>
      <LMap v-if="latitude && longitude" :zoom="13" :center="[latitude, longitude]" style="height: 400px; width: 100%;">
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LMarker :lat-lng="[latitude, longitude]" />
      </LMap>
      <p v-else>Chargement de la carte...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

const props = defineProps({
  communeName: String, // Nom de la commune reçu comme prop
});

const communeDetails = ref({});
const airQuality = ref(null);
const latitude = ref(null);
const longitude = ref(null);
const departmentName = ref(''); // Stocke le nom du département
const regionName = ref(''); // Stocke le nom de la région

// Fonction pour récupérer les détails de la commune
const fetchCommuneDetails = async () => {
  try {
    const { data } = await axios.get(
      `https://geo.api.gouv.fr/communes?nom=${props.communeName}&fields=nom,code,codeDepartement,codesPostaux,population,codeRegion,codeEpci,siren,centre&format=json`
    );
    if (data.length > 0) {
      const commune = data[0];
      communeDetails.value = commune;
      latitude.value = commune.centre.coordinates[1];
      longitude.value = commune.centre.coordinates[0];
      await fetchDepartmentName(commune.codeDepartement);
      await fetchRegionName(commune.codeRegion);
      await fetchAirQuality(commune.nom);
    } else {
      console.error('Commune introuvable.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails :', error);
  }
};

// Fonction pour récupérer le nom du département
const fetchDepartmentName = async (departmentCode) => {
  try {
    const { data } = await axios.get(
      `https://geo.api.gouv.fr/departements/${departmentCode}?fields=nom`
    );
    departmentName.value = data.nom;
  } catch (error) {
    console.error('Erreur lors de la récupération du nom du département :', error);
  }
};

// Fonction pour récupérer le nom de la région
const fetchRegionName = async (regionCode) => {
  try {
    const { data } = await axios.get(
      `https://geo.api.gouv.fr/regions/${regionCode}?fields=nom`
    );
    regionName.value = data.nom;
  } catch (error) {
    console.error('Erreur lors de la récupération du nom de la région :', error);
  }
};

// Fonction pour récupérer la qualité de l'air
const fetchAirQuality = async (cityName) => {
  try {
    const { data } = await axios.get(
      `https://api.waqi.info/feed/${cityName}/?token=9de3bd039a065872af95824d8f881d3a8fdebfa6`
    );
    airQuality.value = data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la qualité de l'air :", error);
  }
};

onMounted(fetchCommuneDetails);
</script>

<style scoped>
h1 {
  margin-bottom: 10px;
}

p {
  margin: 0;
}
</style>
