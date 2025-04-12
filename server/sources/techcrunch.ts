import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const baseURL = "https://techcrunch.com/latest/"
  const html: any = await myFetch(baseURL)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  //   console.log(html)
  //   console.log($(".loop-card").length)
  // Target the article cards on TechCrunch homepage
  $(".loop-card").each((_, el) => {
    const $article = $(el)
    const $link = $article.find(".loop-card__title-link")
    const title = $link.text().trim()
    const url = $link.attr("href")
    const id = url?.split("/").pop() || Math.random().toString()

    // Get publication date if available
    const $time = $article.find("time")
    const pubDate = $time.attr("datetime")

    // Get author if available
    const author = $article.find(".loop-card__author").text().trim()

    // Get category if available
    const category = $article.find(".loop-card__cat").text().trim()

    // Use image as hover content if available
    const imageUrl = $article.find("figure.loop-card__figure img").attr("src") || ""

    // Combine info for hover
    const hoverText = category
      ? `${category}${author ? ` • ${author}` : ""}`
      : (imageUrl ? "View details" : "")

    if (title && url) {
      news.push({
        id,
        title,
        url,
        pubDate,
        extra: {
          hover: hoverText,
          info: author || undefined,
        },
      })
    }
  })

  return news
})
