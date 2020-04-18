const figlet = require("figlet");
const cTable = require("console.table");
const util = require("util");
const inquirer = require("inquirer");
const Use = require("./db/sql");
const use = new Use();
const Que = require("./utils/questions");
const que = new Que();
const _ = require("lodash");
const fuzzy = require("fuzzy");
const add = require("./utils/add");
const show = require("./utils/show");
const bigPrint = util.promisify(figlet.text);
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function clearScreen() {
  data = await bigPrint("Employ-EE", {
    font: "Doom",
  });
  console.clear();
  console.log(data);
  console.log("");
  console.log("");
  console.log("");
}

async function editEmployee() {}

async function getBudgets() {}

async function init(last_action) {
  await clearScreen();
  console.log(last_action);
  const ans = await inquirer.prompt(que.menu);
  await clearScreen();
  switch (await ans.menu) {
    case "a":
      action = await add();
      init(action);
      break;
    case "s":
      action = await show();
      init(action);
      break;
    case "e":
      editEmployee();
      break;
    case "b":
      getBudgets();
      break;
    case "x":
      console.clear();
      use.exit();
      process.exit;
      break;
    default:
      break;
  }
}
init("started");
