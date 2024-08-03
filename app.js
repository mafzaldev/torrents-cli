import fs from "fs";
import PageSingleton from "./src/page-singleton.js";
import scraper from "./src/scraper.js";

const main = async () => {
  console.log("-----------------------------");
  const textOutput = false;
  const torrentDetails = [];
  const movies = fs.readFileSync("movies.txt", "utf-8").split("\n");

  await PageSingleton.initialize();

  for (const movie of movies) {
    console.log(`Current movie: ${movie}`);
    const details = await scraper(movie, textOutput);
    if (details) {
      torrentDetails.push(details);
    }
    console.log("-----------------------------");
  }

  await PageSingleton.close();

  const data = JSON.stringify(torrentDetails, null, 2);
  fs.writeFile("torrents.json", data, (err) => {
    if (err) {
      throw err;
    }
    console.log("Data has been written to torrents.json");
  });
};

main();
