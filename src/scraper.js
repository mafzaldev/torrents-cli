import chalk from "chalk";
import ora from "ora";
import puppeteer from "puppeteer";
import { getTorrentDetail, getTorrentNames, saveToFile } from "./utils.js";

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

    const torrentLink = await page.$eval(
      'a[href^="/torrent/"]',
      (el) => el.href
    );
    await page.goto(torrentLink);

    const title = await page.$eval("h1", (el) => el.textContent);

    spinner.info(` Original torrent name: ${chalk.bgMagentaBright(name)}`);
    spinner.succeed(` Found torrent: ${chalk.black.bgGreenBright(title)}`);

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
