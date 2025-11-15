import chalk from "chalk";
import ora from "ora";
import puppeteer from "puppeteer";
import { calculateSimilarity, getTorrentDetail, getTorrentNames, saveToFile } from "./utils.js";

const scraper = async (inputFile, outputFile, outputType) => {
  const torrentDetails = [];
  const torrentNames = getTorrentNames(inputFile);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const torrent of torrentNames) {
    const details = await scrapeTorrent(page, torrent, outputType);
    if (details) {
      torrentDetails.push(details);
    }
    console.log("-----------------------------");
  }

  await browser.close();

  if (torrentNames.length === 0) {
    return console.error(" No torrent found!");
  } else if (torrentDetails.length === 0) {
    return console.error(
      " Error occurred while scraping torrents. It's not you, it's us!"
    );
  }

  saveToFile(outputType, outputFile, torrentDetails);
};

const scrapeTorrent = async (page, name, outputType) => {
  const spinner = ora(
    `Fetching torrent: ${chalk.bgMagentaBright(name)}`
  ).start();

  try {
    await page.goto(`https://www.1337x.to/sort-search/${name}/seeders/desc/1/`);

    // Get multiple torrent links and their titles from search results
    const torrents = await page.evaluate(() => {
      const results = [];
      const torrentElements = document.querySelectorAll('a[href^="/torrent/"]');
      
      // Get up to 10 results for comparison
      for (let i = 0; i < Math.min(torrentElements.length, 10); i++) {
        const link = torrentElements[i];
        const title = link.textContent.trim();
        const href = link.href;
        
        // Only add unique links (skip duplicates)
        if (!results.some(r => r.href === href)) {
          results.push({ title, href });
        }
      }
      
      return results;
    });

    if (torrents.length === 0) {
      spinner.fail(` No torrents found for: ${name}`);
      return null;
    }

    // Find the best matching torrent based on title similarity
    let bestMatch = torrents[0];
    let bestScore = calculateSimilarity(name, torrents[0].title);

    for (let i = 1; i < torrents.length; i++) {
      const score = calculateSimilarity(name, torrents[i].title);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = torrents[i];
      }
    }

    // Navigate to the best matching torrent
    await page.goto(bestMatch.href);

    const title = await page.$eval("h1", (el) => el.textContent);

    spinner.info(` Original torrent name: ${chalk.bgMagentaBright(name)}`);
    spinner.succeed(` Found torrent: ${chalk.black.bgGreenBright(title)} (match score: ${(bestScore * 100).toFixed(1)}%)`);

    const magnetLink = await page.$eval(
      'a[href^="magnet:?xt=urn:btih:"]',
      (el) => el.href
    );

    if (outputType === "txt") return magnetLink;

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
    spinner.fail(` Error occurred while scraping torrent: ${name}`);
    return null;
  }
};

export default scraper;
