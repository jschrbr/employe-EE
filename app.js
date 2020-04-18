const figlet = require("figlet");
const cTable = require("console.table");
const util = require("util");
const inquirer = require("inquirer");
const Use = require("./db/employee");
var _ = require("lodash");
var fuzzy = require("fuzzy");
const use = new Use();

const bigPrint = util.promisify(figlet.text);
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function exists(check1, cb, sel, frm, wh) {
  let result = 0;
  if (check1 === "+") {
    result = await cb();
  } else {
    const tmp = await use.select(sel, frm, wh, check1);
    result = tmp[0].id;
  }
  return result;
}

async function addEmployee() {
  let ans = await inquirer.prompt(credentials);
  let row = { first_name: ans.first_name, last_name: ans.last_name };
  let sel = "id";
  let frm = "role";
  let wh = "title";
  let role = ans.role;
  row.role_id = await exists(role, createRole, sel, frm, wh);
  await use.insert("employee", row);
  let id = await use.select("LAST_INSERT_ID()");
  id = Object.values(id[0])[0];
  ans = await inquirer.prompt(managers);
  console.log(ans);
  // const mid = await use.select("id", "employee", "id", ans.manager);
  row = { manager_id: ans.manager };
  console.log(row);
  await use.update("employee", row, "id", id);
  init();
}

async function createRole() {
  const ans = await inquirer.prompt(roles);
  let row = { title: ans.title, salary: ans.salary };
  let sel = "id";
  let frm = "department";
  let wh = "name";
  let dep = ans.department;
  row.department_id = await exists(dep, createDepartment, sel, frm, wh);
  await use.insert("role", row);
  const id = await use.select("LAST_INSERT_ID()");
  return Object.values(id[0])[0];
}

async function createDepartment() {
  const ans = await inquirer.prompt(departments);
  await use.insert("department", ans);
  const id = await use.select("LAST_INSERT_ID()");
  return Object.values(id[0])[0];
}

async function searchRoles(answersSoFar, input, a, b) {
  opt = await use.select(a, b);
  // console.log(opt);
  results = [];
  opt.forEach((element) => {
    let str = "";
    check = Object.values(element);
    check.forEach((element) => {
      str += ` ${element}`;
    });
    results.push(str);
  });
  if (b !== "employee") {
    results.unshift(`+`);
  }
  input = input || "";
  return new Promise(function (resolve) {
    setTimeout(function () {
      var fuzzyResult = fuzzy.filter(input, results);
      resolve(
        fuzzyResult.map(function (el) {
          return el.original;
        })
      );
    }, _.random(30, 500));
  });
}

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
    type: "autocomplete",
    name: "role",
    message: "What's the employee's role: ",
    source: (ans, input) => searchRoles(ans, input, "title", "role"),
  },
];

const roles = [
  {
    type: "input",
    name: "title",
    message: "What's the role's title: ",
  },
  {
    type: "number",
    name: "salary",
    message: "What's the role's salary: ",
    default: function () {
      return 0;
    },
  },
  {
    type: "autocomplete",
    name: "department",
    message: "What's the role's department: ",
    source: (ans, input) => searchRoles(ans, input, "name", "department"),
  },
];

const departments = [
  {
    type: "input",
    name: "name",
    message: "What's the department's title: ",
  },
];

const managers = [
  {
    type: "autocomplete",
    name: "manager",
    message: "What's the manager's id: ",
    source: (ans, input) =>
      searchRoles(ans, input, "id, first_name, last_name", "employee"),
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
        await addEmployee();
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
        use.exit();
        process.exit;
        break;
      default:
        break;
    }
  });
}

init();
