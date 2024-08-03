import main from "./src/index.js";
import { getArgs } from "./src/utils.js";

(() => {
  let output = getArgs("output");
  if (!output || !["json", "text"].includes(output)) output = "json";

  main(output);
})();
