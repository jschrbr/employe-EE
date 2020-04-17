const figlet = require("figlet");
const cTable = require("console.table");
const util = require("util");
const inquirer = require("inquirer");

const bigPrint = util.promisify(figlet.text);
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

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

const credentials = [
  {
    type: "input",
    name: "first_name",
    message: "What's the employee's first name: ",
  },
  {
    type: "input",
    name: "last_name",
    message: "What's the employee's last name: ",
    default: function () {
      return "Doe";
    },
  },
  {
    type: "input",
    name: "role",
    message: "What's the employee's role: ",
  },
  {
    type: "input",
    name: "manager",
    message: "Who's the employee's manager: ",
  },
];

const views = [
  {
    type: "list",
    name: "views",
    message: "Choose how to display the employees: ",
    choices: [
      {
        name: "By employee",
        value: "e",
      },
      {
        name: "By department",
        value: "d",
      },
      {
        name: "By role",
        value: "r",
      },
      new inquirer.Separator(),
      {
        name: "Return",
        value: "x",
      },
    ],
  },
];

const edit = [
  {
    type: "autocomplete",
    name: "from",
    message: "Select a state to travel from",
    // source: function(answersSoFar, input) {
    //   return myApi.searchStates(input);
    // }
  },
];

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

async function addEmployee() {
  inquirer
    .prompt(credentials)
    .then((ans) => console.log(ans))
    .then(() => init());
}

async function viewEmployee() {
  inquirer.prompt(views).then((ans) => {
    switch (ans.views) {
      case "e":
        break;
      case "d":
        break;
      case "r":
        break;
      case "x":
        init();
        break;
      default:
        break;
    }
  });
}

async function editEmployee() {}

async function getBudgets() {}

async function init() {
  await clearScreen();
  inquirer.prompt(menu).then(async (answers) => {
    await clearScreen();
    switch (answers.menu) {
      case "a":
        addEmployee();
        break;
      case "s":
        viewEmployee();
        break;
      case "e":
        editEmployee();
        break;
      case "b":
        getBudgets();
        break;
      case "x":
        console.clear();
        process.exit;
        break;
      default:
        break;
    }
  });
}

init();
