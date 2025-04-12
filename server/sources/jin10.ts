interface Jin10Item {
  id: string
  time: string
  type: number
  data: {
    pic?: string
    title?: string
    source?: string
    content?: string
    source_link?: string
    vip_title?: string
    lock?: boolean
    vip_level?: number
    vip_desc?: string
  }
  important: number
  tags: string[]
  channel: number[]
  remark: any[]
}

export default defineSource(async () => {
  const timestamp = Date.now()
  const url = `https://www.jin10.com/flash_newest.js?t=${timestamp}`

  const rawData: string = await myFetch(url)

  const jsonStr = (rawData as string)
    .replace(/^var\s+newest\s*=\s*/, "") // Remove variable declaration at the beginning
    .replace(/;*$/, "") // Remove semicolons at the end if any
    .trim() // Remove whitespace at both ends
  const data: Jin10Item[] = JSON.parse(jsonStr)

  return data.filter(k => (k.data.title || k.data.content) && !k.channel?.includes(5)).map((k) => {
    const text = (k.data.title || k.data.content)!.replace(/<\/?b>/g, "")
    const [,title, desc] = text.match(/^【([^】]*)】(.*)$/) ?? []
    return {
      id: k.id,
      title: title ?? text,
      pubDate: parseRelativeDate(k.time, "Asia/Shanghai").valueOf(),
      url: `https://flash.jin10.com/detail/${k.id}`,
      extra: {
        hover: desc,
        info: !!k.important && "✰",
      },
    }
  })
})
