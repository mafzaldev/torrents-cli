import fs from "fs";
import puppeteer from "puppeteer";

const getTorrentDetailBySibling = async (page, heading) => {
  let result = "";

  const elementHandle = await page.evaluateHandle((heading) => {
    return [...document.querySelectorAll("strong")].find((el) =>
      el.textContent.includes(heading)
    );
  }, heading);

  if (elementHandle && (await elementHandle.asElement())) {
    const siblingHandle = await page.evaluateHandle(
      (el) => el.nextElementSibling,
      elementHandle
    );

    if (siblingHandle && (await siblingHandle.asElement())) {
      const siblingText = await page.evaluate(
        (el) => el.textContent,
        siblingHandle
      );

      result = siblingText;
      await siblingHandle.dispose();
    }
  }

  await elementHandle.dispose();

  return result;
};

const main = async () => {
  try {
    let torrentDetails = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://www.1337x.to/sort-search/Hum+Tum+2004/seeders/desc/1/"
    );

    console.log(await page.evaluate(() => document.title));

    const torrentLink = await page.$eval(
      'a[href^="/torrent/"]',
      (el) => el.href
    );
    await page.goto(torrentLink);

    const title = await page.$eval("h1", (el) => el.textContent);
    const magnetLink = await page.$eval(
      'a[href^="magnet:?xt=urn:btih:"]',
      (el) => el.href
    );
    const totalSize = await getTorrentDetailBySibling(page, "Total size");
    const seeders = await getTorrentDetailBySibling(page, "Seeders");
    const leechers = await getTorrentDetailBySibling(page, "Leechers");
    const uploadedBy = await getTorrentDetailBySibling(page, "Uploaded By");
    const language = await getTorrentDetailBySibling(page, "Language");

    torrentDetails.push({
      title,
      totalSize,
      language,
      magnetLink,
      seeders,
      leechers,
      uploadedBy,
    });

    const torrentDetailsJSON = JSON.stringify(torrentDetails, null, 2);

    fs.writeFile("torrents.json", torrentDetailsJSON, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("Torrent details saved to torrents.json");
      }
    });

    await browser.close();
  } catch (error) {
    console.error("Error occurred: ", error.message);
  }
};

main();
