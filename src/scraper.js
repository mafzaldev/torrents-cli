import PageSingleton from "./page-singleton.js";
import { getTorrentDetail } from "./utils.js";

const scraper = async (name, textOutput) => {
  const page = await PageSingleton.initialize();

  try {
    await page.goto(`https://www.1337x.to/sort-search/${name}/seeders/desc/1/`);

    const torrentLink = await page.$eval(
      'a[href^="/torrent/"]',
      (el) => el.href
    );
    await page.goto(torrentLink);

    const magnetLink = await page.$eval(
      'a[href^="magnet:?xt=urn:btih:"]',
      (el) => el.href
    );

    if (textOutput) return magnetLink;

    const title = await page.$eval("h1", (el) => el.textContent);
    console.log(`Found torrent: ${title}`);
    const totalSize = await getTorrentDetail("Total size");
    const seeders = await getTorrentDetail("Seeders");
    const leechers = await getTorrentDetail("Leechers");
    const language = await getTorrentDetail("Language");
    const uploadedBy = await getTorrentDetail("Uploaded By");

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
