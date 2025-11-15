import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import path from "path";
import process from "process";

/**
 * Calculate similarity between two strings using normalized Levenshtein distance
 * Returns a score between 0 (completely different) and 1 (identical)
 */
const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  // Levenshtein distance calculation
  const matrix = [];
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  
  return 1 - distance / maxLength;
};

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

export { calculateSimilarity, getTorrentDetail, getTorrentNames, saveToFile };
