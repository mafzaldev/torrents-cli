import puppeteer from "puppeteer";
import scraper from "./scraper.js";
import { getTorrentNames, saveToFile } from "./utils.js";

const main = async (inputFile, outputFile, outputType) => {
  console.log("-----------------------------");

  const torrentDetails = [];
  const movies = getTorrentNames(inputFile);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const movie of movies) {
    const details = await scraper(page, movie, outputType);
    if (details) {
      torrentDetails.push(details);
    }
    console.log("-----------------------------");
  }

  await browser.close();

  if (torrentDetails.length === 0) return console.log("No torrents found!");

  saveToFile(outputType, outputFile, torrentDetails);
};

export default main;
