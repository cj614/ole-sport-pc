<template>
  <v-app>
    <v-fade-transition>
      <router-view />
    </v-fade-transition>
    <layout-service></layout-service>
  </v-app>
</template>

<script>
import ROOTVUE from './main'
import { storageRemove, storageSave } from "@/libs/util";
import InitChannel from "@/libs/channel";
export default {
  metaInfo() {
    return {
      title: this.$config.APPNAME
    }
  },
  name: 'App',
  data() {
    return {}
  },
  methods: {
    globalRequest() {
      this.$store.dispatch('app/handleGlobalRequest')
    }
  },
  mounted() {
    storageSave("isFirst", 1)
    storageRemove('token')
    storageRemove('localConfig')
    let timer = requestAnimationFrame(() => {
      if (ROOTVUE) {
        const channelId = this.$route.query.channel || '';
        InitChannel(channelId)

        cancelAnimationFrame(timer)
        this.$store.dispatch('app/handleSetAppTheme', {
          root: ROOTVUE
        })
        this.globalRequest()
      }
    })
  }
}
</script>
