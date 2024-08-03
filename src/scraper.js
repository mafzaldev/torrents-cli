import { getTorrentDetail } from "./utils.js";

const scraper = async (page, name, output) => {
  try {
    await page.goto(`https://www.1337x.to/sort-search/${name}/seeders/desc/1/`);

    const torrentLink = await page.$eval(
      'a[href^="/torrent/"]',
      (el) => el.href
    );
    await page.goto(torrentLink);

    const title = await page.$eval("h1", (el) => el.textContent);
    console.log(`Found torrent: \x1b[32m${title}\x1b[0m`);
    const magnetLink = await page.$eval(
      'a[href^="magnet:?xt=urn:btih:"]',
      (el) => el.href
    );

    if (output === "text") return magnetLink;

    const totalSize = await getTorrentDetail(page, "Total size");
    const seeders = await getTorrentDetail(page, "Seeders");
    const leechers = await getTorrentDetail(page, "Leechers");
    const language = await getTorrentDetail(page, "Language");
    const uploadedBy = await getTorrentDetail(page, "Uploaded By");

    return {
      title,
      totalSize,
      language,
      magnetLink,
      seeders,
      leechers,
      uploadedBy,
    };
  } catch (error) {
    console.error(`Error occurred while scraping ${name}: `, error.message);
    return null;
  }
};

export default scraper;
