<template>
  <div class="about">
    <h1>This is an about pageeeee</h1>
    <el-button disabled>Default</el-button>
    <el-button type="success" disabled>Success</el-button>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
