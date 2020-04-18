const inquirer = require("inquirer");
const Use = require("../db/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function viewEmployee() {
  let ans = await inquirer.prompt(que.views);

  switch (ans.views) {
    case "e":
      break;
    case "d":
      break;
    case "r":
      break;
    case "x":
      return "Returned from show";
      break;
    default:
      break;
  }
}

module.exports = viewEmployee;
