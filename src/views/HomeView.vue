<template>
  <div class="input-wrapper">
    <search-autocomplete
      :items="citiesList"
      :isAsync="true"
      @input="handleCitiesFetch"
      @value-updated="handleCitySelect"
      :chips="chips"
      @add-chip="handleAddChip"
      @delete-chip="handleDeleteChip"
    />
  </div>

  <div class="cards-list-wrapper">
    <div class="period-links">
      <p
        class="period-link"
        v-for="link in periodLinks"
        :key="link"
        :class="{ 'period-link-active': period === link }"
        @click="togglePeriod"
      >
        {{ link }}
      </p>
    </div>
    <cards-list
      :data="cardsData"
      @chart-updated="handleChartUpdate"
      :cardSelected="cardSelected"
    />
  </div>
  <!-- <div v-if="weatherData"> -->
  <!-- <h2>{{ weatherData.city.name }}</h2> -->
  <temperature-chart :cardSelected="cardSelected" />

  <!-- </div> -->
  <confirm-dialogue ref="confirmDialogue" :showOkButton="true" />
  <confirm-dialogue ref="reachedMaxLimit" :showOkButton="false" />
</template>

<script>
import {
  searchCities,
  fetchCurrentWeather,
  fetchByCityCountry,
} from "../api/weatherApi";
import SearchAutocomplete from "../components/SearchAutocomplete.vue";
import TemperatureChart from "../components/TemperatureChart.vue";
import CardsList from "../components/CardsList.vue";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";
import { cardsData } from "../includes/chartWeather";

export default {
  name: "HomeView",
  components: {
    SearchAutocomplete,
    TemperatureChart,
    CardsList,
    ConfirmDialogue,
  },
  data() {
    return {
      citiesList: [],
      weatherData: null,
      selectedValue: "",
      chips: [],
      cardsData: cardsData,
      cardSelected: cardsData[0],
      updateChart: false,
      periodLinks: ["Day", "Week"],
      period: "Day",
    };
  },
  methods: {
    async fetchCities(inputValue) {
      try {
        this.citiesList = await searchCities(inputValue);
        // console.log("cityList", this.citiesList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    },
    selectCity(city) {
      this.inputValue = city;
      this.citiesList = [];
    },
    async handleCitySelect(value) {
      this.selectedValue = value;
      const cityName = this.selectedValue.name;
      const countryCode = this.selectedValue.sys.country;
      if (this.period === "Day") {
        const currentCityWeather = await fetchByCityCountry(
          cityName,
          countryCode
        );
        console.log("handleCitySelect fetchFore5", currentCityWeather);
        this.cardsData.push(currentCityWeather);
      }
      // fetchByCityCountry(cityName, countryCode);
    },
    handleCitiesFetch(newVal) {
      if (newVal && newVal.length) {
        // console.log("input", newVal);
        this.fetchCities(newVal);
      }
    },
    async handleChartUpdate(city) {
      this.cardSelected = city;
    },
    async handleAddChip(result) {
      if (this.chips.length < 5) {
        this.chips.push(result);
      } else {
        await this.$refs.reachedMaxLimit.show({
          message:
            "Maximum number of the cards is 5. Remove any of them to add another one.",
          okButton: "Ok",
        });
      }
    },
    async handleDeleteChip(id) {
      const ok = await this.$refs.confirmDialogue.show({
        message: "Are you sure you want to remove this weather card?",
        okButton: "Remove",
      });
      if (ok) {
        this.chips = this.chips.filter((chip) => chip.id !== id);
        this.cardsData = this.cardsData.filter((card) => card.id !== id);
      } else {
        return;
      }
    },
    togglePeriod() {
      return (this.period = this.period === "Day" ? "Week" : "Day");
    },
  },
  created() {
    // this.fetchWeatherData();
  },
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  margin-bottom: 20px;
}
.cards-list-wrapper {
  height: fit-content;
  width: 100%;
  margin-bottom: 30px;
  background-color: rgba(75, 192, 192, 0.3);
  border-radius: 5px;
  padding: 20px;
}
.period {
  &-links {
    display: flex;
    margin-bottom: 20px;
  }

  &-link {
    padding: 5px 10px;

    background-color: rgba(48, 124, 124, 0.2);
    border: 1px solid transparent;
    border-radius: 5px;
    margin-right: 20px;
    color: rgba(48, 124, 124, 0.9);

    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
  }

  &-link:hover,
  &-link-active {
    background-color: rgba(48, 124, 124, 0.6);
    border: 1px solid rgba(48, 124, 124, 0.9);
    color: white;
  }
}
</style>
