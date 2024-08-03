import PageSingleton from "./page-singleton.js";

const getTorrentDetail = async (heading) => {
  let result = "";
  const page = await PageSingleton.initialize();

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

export { getTorrentDetail };
