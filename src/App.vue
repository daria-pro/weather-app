<template>
  <div id="app" class="app">
    <div class="app__container">
      <nav class="nav">
        <router-link class="nav__link" to="/">Home</router-link>
        <router-link class="nav__link" to="/favorites">Favorites</router-link>
      </nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HomeView from "./views/HomeView.vue";

export default {
  components: {
    HomeView,
  },
};
</script>

<style scoped lang="scss">
.app {
  &__container {
    max-width: 1200px;
    padding: 0 40px;
    margin: 0 auto;

    @include onMobile {
      padding: 0 20px;
    }
  }
}
.nav {
  padding: 20px 10px;
  border-bottom: 1px solid #c9c9c9;
  margin-bottom: 40px;

  &__link {
    color: black;
    padding: 5px 0;
    text-decoration: none;
    margin-right: 30px;

    &:hover {
      opacity: 0.8;
      font-weight: 500;
    }
  }
}
</style>
