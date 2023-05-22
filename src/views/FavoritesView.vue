<template>
  <h1 class="favorites__title">Favorites List</h1>
  <cards-list :data="favorites" />
  <p v-if="!favorites.length">No favorites added.</p>
</template>

<script>
import CardsList from "../components/CardsList.vue";
export default {
  name: "FavoritesView",
  components: { CardsList },
  data() {
    return {
      favorites: [],
    };
  },
  mounted() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  },
};
</script>
<style scoped lang="scss">
.favorites {
  &__title {
    font-weight: 300;
    font-size: 30px;
    margin-bottom: 40px;
  }
}
</style>
