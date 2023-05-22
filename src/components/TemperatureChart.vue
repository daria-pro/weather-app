<template>
  <h2 class="chart__title">
    Weather forecast for {{ cardSelected.city.name }},
    {{ cardSelected.city.country }}
  </h2>
  <div class="chart">
    <canvas ref="weatherChart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { fetchByCityCountry } from "../api/weatherApi";

export default {
  name: "TemperatureChart",
  props: {
    cardSelected: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
    };
  },
  mounted() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.fetchChartDataAndCreateChart();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  watch: {
    cardSelected: {
      async handler(newCity) {
        if (this.chart) {
          await this.chart.destroy();
          this.fetchChartDataAndCreateChart();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async fetchChartDataAndCreateChart() {
      if (this.cardSelected) {
        await this.fetchChartData(this.cardSelected);
        this.createChart();
      }
    },
    async createChart() {
      const ctx = this.$refs.weatherChart.getContext("2d");
      const currentDate = new Date().toISOString().slice(0, 10);
      const filteredData = this.chartData.filter((entry) =>
        entry.dt_txt.includes(currentDate)
      );

      const labels = filteredData.map((entry) => entry.dt_txt);
      const temperatures = filteredData.map((entry) => entry.main.temp);
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "degrees Celcius",
              data: temperatures,
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              borderWidth: 1,
              barThickness: 50,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          maxHeight: 700,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    destroyChart() {
      if (this.chart != null) {
        this.chart.destroy();
      }
    },

    async fetchChartData(city) {
      if (city) {
        // console.log(city);
        // const cityName = city.name;
        // const countryCode = city.sys.country;
        // const data = await fetchByCityCountry(cityName, countryCode);
        // this.chartData = data.list;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.chart {
  max-width: 700px;

  &__title {
    font-weight: 300;
    font-size: 24px;
    margin: 60px 0 20px;
  }
}
</style>
