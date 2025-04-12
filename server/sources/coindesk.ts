import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const baseURL = "https://www.coindesk.com/latest-crypto-news"
  const html: any = await myFetch(baseURL)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  // Target exact Coindesk article structure
  $("div.flex.gap-4, div.bg-white.flex.gap-6").each((_, el) => {
    const $container = $(el)
    const $article = $container.find("div.flex.flex-col").first()

    // Get category
    const $category = $article.find("a.font-title.text-charcoal-600.uppercase")
    const category = $category.text().trim()

    // Get title and URL
    const $titleLink = $article.find("a.text-color-charcoal-900.mb-4.hover\\:underline, a.text-color-charcoal-900")
    const url = $titleLink.attr("href")
    const $title = $titleLink.find("h2.font-headline-xs, h2")
    const title = $title.text().trim()

    // Get description
    const $description = $article.find("p.font-body.text-charcoal-600.mb-4, p.font-body")
    const description = $description.text().trim()

    // Get timestamp
    const $time = $article.find("span.font-metadata.text-color-charcoal-600.uppercase")
    const pubDate = $time.text().trim()

    // Get image if available
    const $img = $container.find("img")
    const imgAlt = $img.attr("alt")

    // Prepare URL with baseURL if needed
    let fullUrl = url
    if (url && !url.startsWith("http")) {
      fullUrl = url.startsWith("/") ? `${"https://www.coindesk.com"}${url}` : `${"https://www.coindesk.com"}/${url}`
    }

    // Generate ID from URL or use random
    const id = fullUrl ? fullUrl.split("/").pop() || Math.random().toString() : Math.random().toString()

    // Only add valid articles
    if (title && fullUrl) {
      news.push({
        id,
        title,
        url: fullUrl,
        pubDate,
        extra: {
          hover: description,
          info: category || "Crypto",
          icon: imgAlt
            ? {
                url: imgAlt,
                scale: 1,
              }
            : undefined,
        },
      })
    }
  })

  // Filter out duplicates by URL
  const uniqueNews = news.filter((item, index, self) =>
    index === self.findIndex(t => t.url === item.url),
  )

  return uniqueNews
})
