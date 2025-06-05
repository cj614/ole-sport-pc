<template>
  <v-menu v-if="localIcon" offset-x left :nudge-right="35" :nudge-bottom="35" :close-on-content-click="true"
    content-class="m_lang_warp">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="lang-btn" fab dark color="red" v-bind="attrs" v-on="on" outlined large width="28" height="28">
        <v-img :src="require(`@/${localIcon.icon}`)" width="28" height="28" :contain="true"></v-img>
      </v-btn>
      <v-img :src="Img.LangDown" class="lang-down" v-bind="attrs" v-on="on" width="14" height="14"
        :contain="true"></v-img>
    </template>

    <v-list dense class="lang-list-nav">
      <v-list-item-group v-model="selectedItem">
        <v-list-item v-for="(item, index) in localMenuConfig" color="rgba(249, 179, 31, 0.15)" :key="index"
          active-class="lang_active" @click="setLocal(item)">
          <v-list-item-avatar min-width="28" width="28" min-height="28" height="28">
            <v-img :src="require(`@/${item.icon}`)" :contain="true"></v-img>
          </v-list-item-avatar>
          <v-list-item-title class="text-dark font-700">{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      Img: {
        LangDown: require(`@/${this.$img.Page.Layout.LangDown}`)
      },
      selectedItem: ''
    }
  },
  computed: {
    localConfig() {
      return this.$store.state.app.localConfig
        ? JSON.parse(this.$store.state.app.localConfig)
        : {}
    },

    localMenuConfig() {
      return this.$store.state.app.localMenuConfig
    },

    localIcon() {
      let { localConfig, localMenuConfig } = this
      let { lang } = localConfig
      let diffArr = localMenuConfig.filter(item => {
        return item.lang === lang
      })

      return diffArr.length ? diffArr[0] : ''
    }
  },

  watch: {
    localMenuConfig(list) {
      if (list.length) {
        let { localConfig, localMenuConfig } = this
        let { lang } = localConfig

        let index = localMenuConfig.findIndex(item => {
          return item.lang === lang
        })
        this.selectedItem = index
      }
    }
  },

  methods: {
    setLocal(item) {
      let _this = this
      this.$store
        .dispatch('app/handleSetLocal', { lang: item.lang })
        .then(() => {
          _this.$router.push({ name: 'home' }).finally(() => {
            location.reload()
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.lang-btn {
  @apply mx-20px;
}

.lang-down {
  @apply absolute right-4px cursor-pointer;
}

.m_lang_warp {
  border-radius: 20px 0 20px 20px !important;

  .lang-list-nav {
    .v-list-item {
      width: 200px;
      min-height: 50px !important;
    }

    .v-list-item:hover {
      background: rgba(249, 179, 31, 0.15);
    }

    .lang_active {
      background: rgba(249, 179, 31, 0.15);
    }

    .v-list-item::before {
      background: rgba(249, 179, 31, 0.15) !important;
    }
  }
}
</style>
