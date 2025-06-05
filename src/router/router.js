import Main from "@/components/layout/main.vue"

export default [
  {
    path: "/",
    name: "main",
    component: Main,
    children: [
      {
        //主页
        path: "/home",
        name: "home",
        component: () => import("@/view/home/index.vue"),
      },
      {
        path: "/home/search",
        name: "homeSearch",
        meta: {
          parentName: 'home'
        },
        component: () => import("@/view/main/homeSearch.vue"),
      },
      {
        path: "/home/more",
        name: "homeMore",
        meta: {
          parentName: 'home'
        },
        component: () => import("@/view/home/homevideomore.vue"),
      },
      {
        // 主播页面
        path: "/live",
        name: "live",
        component: () => import("@/view/live/live.vue"),
      },
     
      {
        // 视频页面
        path: "/video",
        name: "video",
        component: () => import("@/view/video/video.vue"),
      },
      // 视频详情
      {
        path: "/video/details/:id",
        name: "videoDetails",
       
        component: () => import("@/view/video/details.vue"),
      },
     
      {
        path: "/user/agreement",
        name: "userAgreement",
        component: () => import("@/view/main/userAgreement.vue"),
      },
      {
        path: "/privacy/policy",
        name: "privacyPolicy",
        component: () => import("@/view/main/privacyPolicy.vue"),
      },
      {
        path: "/about/us",
        name: "aboutUs",
        component: () => import("@/view/main/aboutUs.vue"),
      },
      {
        path: "/contact/us",
        name: "contactUs",
        component: () => import("@/view/main/contactUs.vue"),
      },

      {
        path: "/live/anchor/room/:id/:all_match_id/:type",
        name: "anchorRoom",
        meta: {
          parentName: 'live'
        },
        component: () => import("@/view/live/anchorRoom.vue"),
      },
  
      {
        // 活动页面
        path: "/activity",
        name: "activity",
        component: () => import("@/view/activity/activity.vue"),
      },
      {
        path: "/activity/detail",
        name: "activityDetail",
        meta: {
          parentName: 'activity'
        },
        component: () => import("@/view/activity/detail.vue"),
      },
      {
        // 下载页面
        path: "/App",
        name: "App",
        component: () => import("@/view/app/app.vue"),
      },
      {
        // 聊天室
        path: "/chat/room",
        name: "chatRoom",
        component: () => import("@/view/chatRoom/index.vue"),
      }
    ]
  },
 
  {
    path: '/user',
    name: 'user',
    component: Main,
    children: [
      {
        path: "/personal/center/:source",
        name: "personalCenter",
        component: () => import("@/view/personalCenter/user.vue"),
      }
    ]
  }
]
