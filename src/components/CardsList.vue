<template>
  <div class="cards-list">
    <city-card
      v-for="city in cardsData ? favorites : data"
      @click="changeChart(city)"
      @add-favorite="toggleFavorites"
      :key="city.id"
      :city="city"
      :class="{ card__active: isCardSelected(city.id) }"
      :isFavorite="isFavorite(city.id)"
    />
    <confirm-dialogue ref="reachedMaxFavLimit" :showOkButton="false" />
  </div>
</template>

<script>
import CityCard from "./CityCard.vue";
import ConfirmDialogue from "./ConfirmDialogue.vue";

export default {
  name: "CardsList",
  components: { CityCard, ConfirmDialogue },
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
      favorites: [],
    };
  },

  methods: {
    changeChart(city) {
      this.$emit("chart-updated", city);
    },
    isCardSelected(id) {
      if (this.cardSelected) {
        return this.cardSelected.id === id;
      }
    },
    async toggleFavorites(card) {
      if (this.favorites.some((item) => item.id === card.id)) {
        this.favorites = this.favorites.filter((item) => item.id !== card.id);
        this.updateStorageFavorites();
      } else if (this.favorites.length < 5) {
        this.favorites.push(card);
        this.updateStorageFavorites();
      } else {
        await this.$refs.reachedMaxFavLimit.show({
          message:
            "Maximum number of the favorites is 5. Remove any of them to add another one.",
          okButton: "Ok",
        });
      }
    },
    isFavorite(id) {
      return this.favorites.some((card) => card.id === id);
    },
    updateStorageFavorites() {
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
  },
  mounted() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  },
  computed: {
    cardsData() {
      return this.$route.name === "favorites";
    },
  },
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
