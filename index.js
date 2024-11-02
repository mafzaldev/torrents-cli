#!/usr/bin/env node

import meow from "meow";
import main from "./src/main.js";

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
      json: {
        type: "boolean",
        shortFlag: "j",
        isRequired: false,
      },
      text: {
        type: "boolean",
        shortFlag: "t",
        isRequired: false,
      },
    },
  });

  const { input, output = "torrents", text } = cli.flags;
  let outputType = "";

  if (text) {
    outputType = "txt";
  } else {
    outputType = "json";
  }

  main(input, `scrapped-${output}.${outputType}`, outputType);
})();
