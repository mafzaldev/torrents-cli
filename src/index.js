import puppeteer from "puppeteer";
import scraper from "./scraper.js";
import { getMovieNames, saveToFile } from "./utils.js";

const main = async (output) => {
  console.log("-----------------------------");

  const torrentDetails = [];
  const INPUT_FILE_PATH = "movies.txt";
  const JSON_FILE_PATH = "torrents.json";
  const TEXT_FILE_PATH = "torrents.txt";
  const movies = getMovieNames(INPUT_FILE_PATH);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const movie of movies) {
    console.log(`Current movie: ${movie}`);
    const details = await scraper(page, movie, output);
    if (details) {
      torrentDetails.push(details);
    }
    console.log("-----------------------------");
  }

  await browser.close();

  if (torrentDetails.length === 0) return console.log("No torrents found!");

  saveToFile(
    output,
    output === "text" ? TEXT_FILE_PATH : JSON_FILE_PATH,
    torrentDetails
  );
};

export default main;
