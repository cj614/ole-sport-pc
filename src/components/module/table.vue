<template>
  <div class="m_table_warp">
    <v-data-table :headers="headers" :items="items" :page.sync="page" :items-per-page="itemsPerPage" :loading="loading"
      hide-default-footer disable-sort disable-filtering disable-pagination class="table_content"
      item-class="item_tr_all" height="100%">
      <template v-slot:no-data>
        <page-empty type="table" top="60" :title="$t(`Module['暂无数据']`)"></page-empty>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 1
    },
    pageCount: {
      type: Number,
      default: 0
    },
    itemsPerPage: {
      type: Number,
      default: 20
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.m_table_warp {
  @apply flex-1 overflow-hidden max-h-680px;

  .table_content {
    background: #292A34;
    @apply h-full;

    .v-data-table-header {
      @apply h-50px;
      background: linear-gradient(90deg, #E5CBAD 0%, #D6B37E 100%);

      th {
        span {
          @apply text-16px font-normal text-hex-5C330A;
        }
      }
    }

    tbody tr {
      @apply h-70px;

      td>span {
        @apply text-16px font-bold text-white;
      }
    }
  }
}
</style>