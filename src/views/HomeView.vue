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
      :data="weekData"
      @chart-updated="handleChartUpdate"
      :cardSelected="cardSelected"
      :period="period"
    />
  </div>

  <temperature-chart
    v-if="cardSelected"
    :cardSelected="cardSelected"
    :period="period"
    :weekData="weekData"
  />

  <confirm-dialogue ref="confirmDialogue" :showOkButton="true" />
  <confirm-dialogue ref="reachedMaxLimit" :showOkButton="false" />
</template>

<script>
import {
  searchCities,
  fetchCurrentWeather,
  fetchByCityCountry,
  fetchGeolocationData,
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
      cardsData: [],
      weekData: [],
      averagedDataWeek: [],
      cardSelected: null,
      periodLinks: ["Day", "Week"],
      period: "Day",
      ipInfo: {
        city: "",
        countryCode: "",
      },
    };
  },
  methods: {
    async fetchCities(inputValue) {
      try {
        this.citiesList = await searchCities(inputValue);
        console.log("citiesList", this.citiesList);
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
      const currentCityWeather = await fetchByCityCountry(
        cityName,
        countryCode
      );
      this.cardsData.push(currentCityWeather);
      this.getWeekData();
      this.updateStorageDefaultList();
    },
    handleCitiesFetch(newVal) {
      if (newVal && newVal.length) {
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
        console.log(this.weekData);
        this.weekData = this.weekData.filter((card) => card.city.id !== id);
      } else {
        return;
      }
    },
    togglePeriod() {
      return (this.period = this.period === "Day" ? "Week" : "Day");
    },
    calculateAverageTemperature(list) {
      const result = [];
      const dates = {};

      for (const item of list) {
        const date = item.dt_txt.split(" ")[0];

        const newDate = new Date(date);
        const options = { weekday: "long" };

        if (!dates[date]) {
          dates[date] = {
            date: date,
            temperatures: [item.main.temp],
            icon: item.weather[0].icon,
            weekDay: newDate
              .toLocaleDateString("en-US", options)
              .substr(0, 3)
              .toUpperCase(),
            humidity: item.main.humidity,
            wind: item.wind.speed.toFixed(0),
          };
        } else {
          dates[date].temperatures.push(item.main.temp);
        }
      }

      for (const date in dates) {
        const temperatures = dates[date].temperatures;
        const averageTemperature =
          temperatures.reduce((sum, temp) => sum + temp, 0) /
          temperatures.length;
        dates[date].averageTemperature = averageTemperature.toFixed(0);
        result.push(dates[date]);
      }

      return result;
    },
    updateStorageDefaultList() {
      localStorage.setItem("defaultList", JSON.stringify(this.weekData));
    },
    getWeekData() {
      const clonedData = JSON.parse(JSON.stringify(this.cardsData));
      const weekData = clonedData.map((obj) => {
        return {
          ...obj,
          list: this.calculateAverageTemperature(obj.list),
        };
      });

      this.weekData = weekData;
    },
    async getIpInfo() {
      const data = await fetchGeolocationData();
      console.log("data", data);
      this.ipInfo.city = data.city;
      this.ipInfo.countryCode = data.countryCode;
      const cityWeatherByIp = await fetchByCityCountry(
        this.ipInfo.city,
        this.ipInfo.countryCode
      );
      console.log("cityWeatherByIp", cityWeatherByIp);
      this.cardsData.push(cityWeatherByIp);
      this.getWeekData();
      this.updateStorageDefaultList();
      this.chips.push({
        id: cityWeatherByIp.city.id,
        name: cityWeatherByIp.city.name,
        sys: { country: cityWeatherByIp.city.country },
      });
      this.cardSelected = this.cardsData[0];
    },
  },
  computed: {},
  mounted() {},
  created() {
    console.log("hi", this.weekData);
    const storedDefaultList = localStorage.getItem("defaultList");
    if (storedDefaultList) {
      const defaultList = JSON.parse(storedDefaultList);
      this.weekData = defaultList;
      this.chips = defaultList.map((city) => {
        return {
          id: city.city.id,
          name: city.city.name,
          sys: { country: city.city.country },
        };
      });
      this.cardSelected = this.weekData[0];
    } else {
      this.getIpInfo();
    }
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

  @include onMobile {
    padding: 10px;
  }
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
