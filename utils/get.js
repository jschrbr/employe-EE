const inquirer = require("inquirer");
const Use = require("../db/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function getBudgets() {}

module.exports = getBudgets;
