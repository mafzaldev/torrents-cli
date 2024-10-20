import chalk from "chalk";
import ora from "ora";
import { getTorrentDetail } from "./utils.js";

const scraper = async (page, name, output) => {
  const spinner = ora(`Fetching torrent: ${chalk.bgMagenta(name)}`).start();

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
    spinner.fail(`Error occurred while scraping ${name}: ` + error.message);
    return null;
  }
};

export default scraper;
