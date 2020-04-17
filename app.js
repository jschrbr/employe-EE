const figlet = require("figlet");
const cTable = require("console.table");
const util = require("util");
const inquirer = require("inquirer");

const bigPrint = util.promisify(figlet.text);

const menu = [
  {
    type: "list",
    name: "menu",
    message: "What do you want to do?",
    choices: [
      {
        name: "Add an employee",
        value: "a",
      },
      {
        name: "View employees",
        value: "s",
      },
      {
        name: "Edit employee",
        value: "e",
      },
      {
        name: "Budgets",
        value: "b",
      },
      new inquirer.Separator(),
      {
        name: "Exit",
        value: "x",
      },
    ],
  },
];

const addEmployee;

const viewEmployee;

const editEmployee;


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

async function init() {
  await clearScreen();
  inquirer.prompt(menu).then(async (answers) => {
    await clearScreen();
    console.log(answers);
    switch (answers.menu) {
        case "a":
            break;
        case "s":
            break;
        case "e":
            break;
        case "b":
            break;
        case "x":
            break;
        default:
            break;
    }
    console.table(["Hello", "world"]);
  });
}

init();
