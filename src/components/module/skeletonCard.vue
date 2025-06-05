<template>
  <div class="m_skeleton_warp">
    <template v-if="skeleton === 'live'">
      <v-skeleton-loader v-for="item in 20" :key="item" class="mx-auto" :width="width" :height="height" loading
        type="card-avatar,article@2"></v-skeleton-loader>
    </template>

    <template v-else-if="skeleton === 'match'">
      <v-skeleton-loader :width="width" :height="height" loading type="table"></v-skeleton-loader>
    </template>

    <template v-else>
      <v-skeleton-loader v-for="item in forIt" :key="item" :class="skeletonClass" :width="width" :height="height"
        loading :type="type"></v-skeleton-loader>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    skeleton: {
      type: String,
      default: ''
    },

    skeletonClass: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      default: 'card'
    },

    forIt: {
      type: [Number, String],
      default: 3
    },

    height: {
      type: [Number, String],
      default: 232
    },

    width: {
      type: [Number, String],
      default: 305
    }
  }
}
</script>

<style lang="scss" scoped>
.m_skeleton_warp {
  @apply flex flex-wrap;

  .v-skeleton-loader {
    @apply mb-20px;

    .v-skeleton-loader__image {
      @apply h-171px;
    }
  }
}
</style>