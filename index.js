#!/usr/bin/env node

import cli from "./src/cli.js";
import { getArgs } from "./src/utils.js";

(() => {
  let output = getArgs("output");
  if (!output || !["json", "text"].includes(output)) output = "json";

  cli(output);
})();
