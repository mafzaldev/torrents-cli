import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import path from "path";
import process from "process";

const getTorrentDetail = async (page, heading) => {
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

const getTorrentNames = (filePath) => {
  try {
    const torrents = fs.readFileSync(filePath, "utf-8").split("\n");
    return torrents;
  } catch (error) {
    console.error("Error: ", error.message);
    return [];
  }
};

const saveToFile = (output, fileName, details) => {
  const spinner = ora("Saving to file...").start();

  const currentDir = process.cwd();
  const filePath = path.join(currentDir, fileName);

  const content =
    output === "txt" ? details.join("\n") : JSON.stringify(details, null, 2);

  try {
    fs.writeFileSync(filePath, content);
    spinner.succeed(
      ` Torrent details have been saved to: ${chalk.black.bgGreenBright(
        filePath
      )}`
    );
  } catch (err) {
    spinner.fail(`Error occurred while saving to file: ${err.message}`);
  } finally {
    spinner.stop();
  }
};

export { getTorrentDetail, getTorrentNames, saveToFile };
