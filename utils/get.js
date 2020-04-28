const inquirer = require("inquirer");
const Use = require("../config/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();
const Clear = require("./clear");
const clear = new Clear();
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const creds = "role.salary";
const joins =
  "employee JOIN role ON employee.role_id=role.id JOIN department ON department.id=role.department_id";

async function showAll(a = 0) {
  let data = await use.select(creds, joins);
  if (data.length > 0) {
    let total = 0;
    data.forEach((element) => {
      total += parseFloat(element.salary);
    });
    console.log("");
    console.table([{ Employees: `$${total}` }]);
    console.log("");
  }
  console.log("");
  console.log("");
  return false;
}

async function showDepartment() {
  data = await use.select("*", "department");
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let total = 0;
    element = data[i];
    let table = await use.select(
      creds,
      `${joins} WHERE role.department_id=${element.id}`
    );
    table.forEach((element) => {
      total += parseFloat(element.salary);
    });
    result.push([{ [element.name]: total }]);
  }
  result.forEach((element) => {
    console.log("");
    console.table(element);
    console.log("");
  });
  console.log("");
  console.log("");
  return false;
}
async function showRole() {
  let data = await use.select("*", "role");
  result = [];
  for (let i = 0; i < data.length; i++) {
    let total = 0;
    element = data[i];
    let table = await use.select(
      creds,
      `${joins} WHERE employee.role_id=${element.id}`
    );
    table.forEach((element) => {
      total += parseFloat(element.salary);
    });
    // total = table.reduce((a, x) => (a.salary += parseFloat(x.salary)));
    result.push([{ [element.title]: `$${total}` }]);
  }
  result.forEach((element) => {
    console.log("");
    console.table(element);
    console.log("");
  });
  console.log("");
  console.log("");
  return false;
}

async function getBudgets(view = false) {
  if (!(typeof view.then === "function")) {
    if (view) {
      await clear.clear();
      await showAll(10);
    }
    que.show.message = "Choose how to display the employees: ";
    let ans = await inquirer.prompt(que.show);
    await clear.clear();
    switch (ans.views) {
      case "e":
        return getBudgets(await showAll());
      case "d":
        return getBudgets(await showDepartment());
      case "r":
        return getBudgets(await showRole());
      default:
        return "Returned from budgets";
    }
  }
}

module.exports = getBudgets;
