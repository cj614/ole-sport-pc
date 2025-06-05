<template>
  <div>
    <v-skeleton-loader
      v-for="item in 20"
      :key="item"
      width="160"
      height="40"
      loading
      type="list-item-avatar"
    ></v-skeleton-loader>
  </div>
</template>