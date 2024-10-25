<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="root">
    <div class="navbar">  
      <p class="title">Leaderboards.gg Admin Panel</p>
      <button class="button log-out-button">Log Out</button>
    </div>
    <div class="main-content">
      Functionality here!
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
}

.navbar {
  display: flex;
  height: 48px;
  background-color: green;
  padding: 8px;
  align-items: center;
  justify-content: center;
}

.main-content {
  margin: 8px;
}

.log-out-button {
  display: flex;
  height: 40px;
  margin-left: auto;
  align-items: center;
  justify-content: center;
}

.title {
  display: flex;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  line-height: unset;
}
</style>
