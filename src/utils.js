import fs from "fs";
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

const getArgs = (key) => {
  if (process.argv.includes(`--${key}`)) return true;
  const value = process.argv.find((element) => element.startsWith(`--${key}=`));
  if (!value) return null;
  return value.replace(`--${key}=`, "");
};

const getMovieNames = (filePath) => {
  try {
    const movies = fs.readFileSync(filePath, "utf-8").split("\n");
    return movies;
  } catch (error) {
    console.error("Error: ", error.message);
    return [];
  }
};

const saveToFile = (output, filePath, details) => {
  const data =
    output === "text" ? details.join("\n") : JSON.stringify(details, null, 2);

  fs.writeFile(filePath, data, (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `Torrent details has been saved to: \x1b[33m${filePath}\x1b[0m`
    );
  });
};

export { getArgs, getMovieNames, getTorrentDetail, saveToFile };
