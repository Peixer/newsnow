import process from "node:process"
import { Interval } from "./consts"
import { typeSafeObjectFromEntries } from "./type.util"
import type { OriginSource, Source, SourceID } from "./types"

const Time = {
  Test: 1,
  Realtime: 2 * 60 * 1000,
  Fast: 5 * 60 * 1000,
  Default: Interval, // 10min
  Common: 30 * 60 * 1000,
  Slow: 60 * 60 * 1000,
}

export const originSources = {
  "v2ex": {
    name: "V2EX",
    color: "slate",
    home: "https://v2ex.com/",
    sub: {
      share: {
        title: "Latest Shares",
        column: "tech",
      },
    },
  },
  "zhihu": {
    name: "Zhihu",
    type: "hottest",
    column: "china",
    color: "blue",
    home: "https://www.zhihu.com",
  },
  "weibo": {
    name: "Weibo",
    title: "Real-time Hot Search",
    type: "hottest",
    column: "china",
    color: "red",
    interval: Time.Realtime,
    home: "https://weibo.com",
  },
  "zaobao": {
    name: "Lianhe Zaobao",
    interval: Time.Common,
    type: "realtime",
    column: "world",
    color: "red",
    desc: "From third-party site: Morning Report",
    home: "https://www.zaobao.com",
  },
  "coolapk": {
    name: "Coolapk",
    type: "hottest",
    column: "tech",
    color: "green",
    title: "Today's Hottest",
    home: "https://coolapk.com",
  },
  "wallstreetcn": {
    name: "WallStreetCN",
    color: "blue",
    column: "finance",
    home: "https://wallstreetcn.com/",
    sub: {
      quick: {
        type: "realtime",
        interval: Time.Fast,
        title: "Real-time News",
      },
      news: {
        title: "Latest Information",
        interval: Time.Common,
      },
      hot: {
        title: "Hottest Articles",
        type: "hottest",
        interval: Time.Common,
      },
    },
  },
  "36kr": {
    name: "36Kr",
    type: "realtime",
    color: "blue",
    // cloudflare pages cannot access
    disable: "cf",
    home: "https://36kr.com",
    column: "tech",
    sub: {
      quick: {
        title: "Quick News",
      },
    },
  },
  "douyin": {
    name: "Douyin",
    type: "hottest",
    column: "china",
    color: "gray",
    home: "https://www.douyin.com",
  },
  "hupu": {
    name: "Hupu",
    disable: true,
    home: "https://hupu.com",
  },
  "tieba": {
    name: "Baidu Tieba",
    title: "Hot Topics",
    column: "china",
    type: "hottest",
    color: "blue",
    home: "https://tieba.baidu.com",
  },
  "toutiao": {
    name: "Toutiao",
    type: "hottest",
    column: "china",
    color: "red",
    home: "https://www.toutiao.com",
  },
  "ithome": {
    name: "IT Home",
    color: "red",
    column: "tech",
    type: "realtime",
    home: "https://www.ithome.com",
  },
  "thepaper": {
    name: "The Paper",
    interval: Time.Common,
    type: "hottest",
    column: "china",
    title: "Hot List",
    color: "gray",
    home: "https://www.thepaper.cn",
  },
  "sputniknewscn": {
    name: "Sputnik News",
    color: "orange",
    // cloudflare pages cannot access
    disable: "cf",
    column: "world",
    home: "https://sputniknews.cn",
  },
  "cankaoxiaoxi": {
    name: "Reference News",
    color: "red",
    column: "world",
    interval: Time.Common,
    home: "https://china.cankaoxiaoxi.com",
  },
  "pcbeta": {
    name: "PCbeta Forum",
    color: "blue",
    column: "tech",
    home: "https://bbs.pcbeta.com",
    sub: {
      windows11: {
        title: "Windows 11",
        type: "realtime",
        interval: Time.Fast,
      },
      windows: {
        title: "Windows Resources",
        type: "realtime",
        interval: Time.Fast,
      },
    },
  },
  "cls": {
    name: "CLS.cn",
    color: "red",
    column: "finance",
    home: "https://www.cls.cn",
    sub: {
      telegraph: {
        title: "Telegraph",
        interval: Time.Fast,
        type: "realtime",
      },
      depth: {
        title: "In-depth",
      },
      hot: {
        title: "Popular",
        type: "hottest",
      },
    },
  },
  "xueqiu": {
    name: "Xueqiu",
    color: "blue",
    home: "https://xueqiu.com",
    column: "finance",
    sub: {
      hotstock: {
        title: "Hot Stocks",
        interval: Time.Realtime,
        type: "hottest",
      },
    },
  },
  "gelonghui": {
    name: "Gelonghui",
    color: "blue",
    title: "Events",
    column: "finance",
    type: "realtime",
    interval: Time.Realtime,
    home: "https://www.gelonghui.com",
  },
  "fastbull": {
    name: "Fastbull Finance",
    color: "emerald",
    home: "https://www.fastbull.cn",
    column: "finance",
    sub: {
      express: {
        title: "Quick News",
        type: "realtime",
        interval: Time.Realtime,
      },
      news: {
        title: "Headlines",
        interval: Time.Common,
      },
    },
  },
  "solidot": {
    name: "Solidot",
    color: "teal",
    column: "tech",
    home: "https://solidot.org",
    interval: Time.Slow,
  },
  "hackernews": {
    name: "Hacker News",
    color: "orange",
    column: "tech",
    type: "hottest",
    home: "https://news.ycombinator.com/",
  },
  "producthunt": {
    name: "Product Hunt",
    color: "red",
    column: "tech",
    type: "hottest",
    home: "https://www.producthunt.com/",
  },
  "github": {
    name: "Github",
    color: "gray",
    home: "https://github.com/",
    column: "tech",
    sub: {
      "trending-today": {
        title: "Today",
        type: "hottest",
      },
    },
  },
  "bilibili": {
    name: "Bilibili",
    color: "blue",
    home: "https://www.bilibili.com",
    sub: {
      "hot-search": {
        title: "Hot Search",
        column: "china",
        type: "hottest",
      },
      "hot-video": {
        title: "Hot Videos",
        disable: "cf",
        column: "china",
        type: "hottest",
      },
      "ranking": {
        title: "Rankings",
        column: "china",
        disable: "cf",
        type: "hottest",
        interval: Time.Common,
      },
    },
  },
  "kuaishou": {
    name: "Kuaishou",
    type: "hottest",
    column: "china",
    color: "orange",
    // cloudflare pages cannot access
    disable: "cf",
    home: "https://www.kuaishou.com",
  },
  "kaopu": {
    name: "Kaopu News",
    column: "world",
    color: "gray",
    interval: Time.Common,
    desc: "Not necessarily reliable, read more and think more",
    home: "https://kaopu.news/",
  },
  "jin10": {
    name: "Jin10 Data",
    column: "finance",
    color: "blue",
    type: "realtime",
    home: "https://www.jin10.com",
  },
  "baidu": {
    name: "Baidu Hot Search",
    column: "china",
    color: "blue",
    type: "hottest",
    home: "https://www.baidu.com",
  },
  "linuxdo": {
    name: "LINUX DO",
    column: "tech",
    color: "slate",
    home: "https://linux.do/",
    disable: "cf",
    sub: {
      latest: {
        title: "Latest",
        home: "https://linux.do/latest",
      },
      hot: {
        title: "Today's Hottest",
        type: "hottest",
        interval: Time.Common,
        home: "https://linux.do/hot",
      },
    },
  },
  "ghxi": {
    name: "Ghxi",
    column: "china",
    color: "yellow",
    disable: "cf",
    home: "https://www.ghxi.com/",
  },
  "smzdm": {
    name: "SMZDM",
    column: "china",
    color: "red",
    type: "hottest",
    home: "https://www.smzdm.com",
  },
  "nowcoder": {
    name: "Nowcoder",
    column: "china",
    color: "blue",
    type: "hottest",
    home: "https://www.nowcoder.com",
  },
  "sspai": {
    name: "Sspai",
    column: "tech",
    color: "red",
    type: "hottest",
    home: "https://sspai.com",
  },
  "juejin": {
    name: "Juejin",
    type: "hottest",
    column: "tech",
    color: "blue",
    home: "https://juejin.cn",
  },
  "techcrunch": {
    name: "TechCrunch",
    color: "green",
    column: "tech",
    home: "https://techcrunch.com",
  },
} as const satisfies Record<string, OriginSource>

export function genSources() {
  const _: [SourceID, Source][] = []

  Object.entries(originSources).forEach(([id, source]: [any, OriginSource]) => {
    const parent = {
      name: source.name,
      type: source.type,
      disable: source.disable,
      desc: source.desc,
      column: source.column,
      home: source.home,
      color: source.color ?? "primary",
      interval: source.interval ?? Time.Default,
    }
    if (source.sub && Object.keys(source.sub).length) {
      Object.entries(source.sub).forEach(([subId, subSource], i) => {
        if (i === 0) {
          _.push([id, {
            redirect: `${id}-${subId}`,
            ...parent,
            ...subSource,
          }] as [any, Source])
        }
        _.push([`${id}-${subId}`, { ...parent, ...subSource }] as [any, Source])
      })
    } else {
      _.push([id, {
        title: source.title,
        ...parent,
      }])
    }
  })

  return typeSafeObjectFromEntries(_.filter(([_, v]) => {
    if (v.disable === "cf" && process.env.CF_PAGES) {
      return false
    } else if (v.disable === true) {
      return false
    } else {
      return true
    }
  }))
}
