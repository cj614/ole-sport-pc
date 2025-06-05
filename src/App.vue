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
import { themes } from './themes';
import { storageRemove, storageSave, applyTheme } from "@/libs/util";
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
    },
    // toggleTheme() {
    //   this.currentTheme = this.currentTheme.name === 'light' ? themes.dark : themes.light;
    //   applyTheme(this.currentTheme);
    //   localStorage.setItem('theme', this.currentTheme.name);
    // },
  },
  mounted() {
    storageSave("isFirst", 1)
    storageRemove('token')
    storageRemove('localConfig')
    // 优先使用 localStorage 记住用户选择
    const saved = localStorage.getItem('theme');
    if (saved && themes[saved]) {
      this.currentTheme = themes[saved];
    } else {
      // 否则根据系统默认
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? themes.dark : themes.light;
    }

    applyTheme(this.currentTheme);

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newTheme = e.matches ? themes.dark : themes.light;
      if (localStorage.getItem('theme')) return; // 用户已手动选择，跳过
      this.currentTheme = newTheme;
      applyTheme(this.currentTheme);
    });
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
