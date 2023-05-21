<template>
  <div class="card">
    <h2 class="card__title">{{ `${city.name}, ${city.sys.country} ` }}</h2>
    <h3 class="card__subtitle">
      {{ city.weather.main
      }}<span
        >Wind {{ city.wind.speed.toFixed(0) }}km/h
        <span class="dot">•</span> Humidity {{ city.main.humidity }}%</span
      >
    </h3>
    <div class="card__temperature-wrapper">
      <div class="card__icon-part-wrapper">
        <img
          class="weather-icon"
          :src="`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`"
          alt="weather icon"
        />
        <p class="card__paragraph">
          Feels like: {{ city.main.feels_like.toFixed(0) }}°
        </p>
        <p class="card__paragraph">
          Min: {{ city.main.temp_min.toFixed(0) }}° <br />
          Max: {{ city.main.temp_max.toFixed(0) }}°
        </p>
      </div>

      <h1 class="card-temperature">{{ city.main.temp.toFixed(0) }}°</h1>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "CityCard",
  props: {
    city: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
@import url(https://fonts.googleapis.com/css?family=Roboto:400,300);
html,
body {
  background-color: #f3f3f3;
  font-family: "Roboto", sans-serif;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  max-width: 400px;
  width: 100%;
  height: fit-content;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);
  -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1);
  cursor: pointer;

  &__active,
  &:hover {
    box-shadow: 1px 2px 10px rgba(1, 185, 170, 0.534);
  }

  &__title {
    font-weight: 300;
    font-size: 2.26em;
    margin: 0 0 10px;
    -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1);
  }

  &__subtitle {
    float: left;
    margin: 0;
    color: #777;
    font-weight: 400;
    font-size: 1em;
    -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1) 0.1s;
  }

  &__paragraph {
    color: #777;
    font-weight: 400;
    line-height: 1.2;
  }

  &__temperature-wrapper {
    display: flex;
    align-items: flex-start;
  }

  &__icon-part-wrapper {
    display: flex;
    flex-direction: column;
    width: 200px;
  }
}

@-webkit-keyframes open {
  from {
    padding: 0 30px;
    height: 0;
  }
  to {
    height: 230px;
  }
}

h1,
h2,
h3,
h4 {
  position: relative;
}

h1 {
  float: right;
  color: #666;
  font-weight: 300;
  font-size: 5.5em;
  line-height: 1.1;
  margin: 0;
  -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1) 0.2s;
}

span {
  color: #999;
  font-weight: 300;
}

span span {
  margin-left: 0;
}

.dot {
  font-size: 0.9em;
}

.weather-icon {
  position: relative;
  width: 70px;
  height: 70px;
  margin-right: 15px;
  -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1) 0.2s;
}

table {
  position: relative;
  top: 10px;
  width: 100%;
  text-align: center;
}

tr:nth-child(1) td:nth-child(1),
tr:nth-child(1) td:nth-child(2),
tr:nth-child(1) td:nth-child(3),
tr:nth-child(1) td:nth-child(4),
tr:nth-child(1) td:nth-child(5) {
  padding-bottom: 32px;
  -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1) 0.7s;
}

tr:nth-child(2) td:nth-child(1),
tr:nth-child(2) td:nth-child(2),
tr:nth-child(2) td:nth-child(3),
tr:nth-child(2) td:nth-child(4),
tr:nth-child(2) td:nth-child(5) {
  padding-bottom: 7px;
  -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1) 0.9s;
}

tr:nth-child(3) td:nth-child(1),
tr:nth-child(3) td:nth-child(2),
tr:nth-child(3) td:nth-child(3),
tr:nth-child(3) td:nth-child(4),
tr:nth-child(3) td:nth-child(5) {
  padding-bottom: 7px;
  -webkit-animation: open 1s cubic-bezier(0.39, 0, 0.38, 1) 0.9s;
}

tr:nth-child(2),
tr:nth-child(3) {
  font-size: 0.9em;
}

tr:nth-child(3) {
  color: #999;
}

@-webkit-keyframes open {
  0% {
    opacity: 0;
    -webkit-transform: translateY(15px);
  }
  50% {
    opacity: 0;
    -webkit-transform: translateY(15px);
  }
  99% {
    -webkit-animation-play-state: paused;
  }
  100% {
    opacity: 1;
  }
}
</style>
