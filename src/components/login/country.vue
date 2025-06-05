<template>
  <v-menu offset-y :nudge-left="10" :nudge-bottom="10" :close-on-content-click="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined min-width="93" color="#fff" text height="24" v-bind="attrs" v-on="on">
        <span class="sel-tit">{{mobile.code}}</span>
        <span class="sel-tit">{{mobile.country}}</span>
        <span>
          <v-img :src="Img.CountDown" width="12" height="12"></v-img>
        </span>
      </v-btn>
    </template>|
    <v-list dense height="300" min-width="93" class="count_list scrollbar-hide">
      <v-list-item-group v-model="selectedItem" color="#F9B31F">
        <v-list-item v-for="(item, index) in CodeList" color="#F9B31F" :key="index">
          <v-list-item-title>
            <span class="code">{{item.code}}</span>
            <span class="code code1">{{item.country}}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    CodeList: {
      type: Array
    }
  },
  data() {
    return {
      selectedItem: 0,
      Img: {
        CountDown: require(`@/${this.$img.Page.Login.CountDown}`)
      }
    }
  },

  computed: {
    mobile() {
      let data = this.CodeList[this.selectedItem] || {
        code: '+84',
        country: 'Vietnam',
        country_code: 'VN'
      }
      this.$emit('setCountryCode', data)
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  border: none !important;
  padding: 0px !important;
  text-transform: none;
  text-indent: 0px;
}
.sel-tit {
  @apply text-16px font-normal text-dark mr-4px;
}
.count_list {
  .v-item-group {
    @apply bg-lightFirst;
    .v-list-item__title {
      @apply flex items-center text-16px font-normal;

      .code1 {
        @apply ml-10px;
      }
    }
    .v-list-item:hover {
      @apply text-warning;
    }
  }
}
.count_list::-webkit-scrollbar {
  width: 0px !important;
  height: 0px !important;
}
</style>