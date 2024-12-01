#!/usr/bin/env node

import chalk from "chalk";
import meow from "meow";
import scraper from "./src/scraper.js";

(() => {
  const cli = meow({
    importMeta: import.meta,
    flags: {
      input: {
        type: "string",
        isRequired: true,
      },
      output: {
        type: "string",
        isRequired: false,
      },
    },
  });

  const { input, output = "torrents.json" } = cli.flags;
  let outputFile = output.split(".")[0];
  let outputType = output.split(".")[1];

  console.log("-----------------------------");

  if (input === "") {
    return console.log(
      `Empty ${chalk.bgRed(
        "--input"
      )} flag. Please type input file name and retry.`
    );
  }

  if (outputType === undefined) {
    outputType = "json";
  }

  scraper(input, `scrapped-${outputFile}.${outputType}`, outputType);
})();
