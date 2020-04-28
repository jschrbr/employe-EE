const readline = require("readline");
const inquirer = require("inquirer");
const cTable = require("console.table");

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

const creds =
  "employee.first_name, employee.last_name, role.title, department.name, employee.manager_id";
const joins =
  "employee JOIN role ON employee.role_id=role.id JOIN department ON department.id=role.department_id";

async function showAll(a = 0) {
  let data = await use.select(creds, joins);
  if (a === 0) {
    a = data.length + 1;
  }
  if (data.length > 0) {
    console.log("");
    console.table(
      "Employees",
      data.filter((e) => data.indexOf(e) < a)
    );
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
    element = data[i];
    let table = await use.select(
      creds,
      `${joins} WHERE role.department_id=${element.id}`
    );
    result.push([element.name, table]);
  }
  result.forEach((element) => {
    console.log("");
    console.table(...element);
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
    element = data[i];
    let table = await use.select(
      creds,
      `${joins} WHERE employee.role_id=${element.id}`
    );
    result.push([element.title, table]);
  }
  result.forEach((element) => {
    console.log("");
    console.table(...element);
    console.log("");
  });
  console.log("");
  console.log("");
  return false;
}

async function viewEmployee(view = false) {
  if (!(typeof view.then === "function")) {
    if (view) {
      await clear.clear();
      await showAll(10);
    }
    que.show.message = "Choose how to display the budgets: ";
    let ans = await inquirer.prompt(que.show);
    await clear.clear();
    switch (ans.views) {
      case "e":
        return viewEmployee(await showAll());
      case "d":
        return viewEmployee(await showDepartment());
      case "r":
        return viewEmployee(await showRole());
      default:
        return "Returned from selector";
    }
  }
}

module.exports = viewEmployee;
