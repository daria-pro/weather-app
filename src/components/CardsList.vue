<template>
  <div class="cards-list">
    <city-card
      v-for="city in data"
      @click="changeChart(city)"
      :key="city.id"
      :city="city"
      :class="{ card__active: isCardSelected(city.id) }"
    />
  </div>
</template>

<script>
import CityCard from "./CityCard.vue";

export default {
  name: "CardsList",
  components: { CityCard },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    cardSelected: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      cities: [],
    };
  },

  methods: {
    changeChart(city) {
      this.$emit("chart-updated", city);
    },
    isCardSelected(id) {
      return this.cardSelected.id === id;
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.cards-list {
  display: grid;
  grid-template-columns: minmax(280px, 400px) minmax(280px, 400px) minmax(
      280px,
      400px
    );
  gap: 20px;

  @include onTablet {
    grid-template-columns: minmax(300px, 400px) minmax(300px, 400px);
  }

  @include onMobile {
    grid-template-columns: minmax(280px, 400px);
    margin: 0 auto;
  }
}
</style>
