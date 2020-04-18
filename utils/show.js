const readline = require("readline");
const inquirer = require("inquirer");
const cTable = require("console.table");

const Use = require("../db/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function clear() {
  const blank = "\n".repeat(process.stdout.rows);
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

async function showAll(a = 0) {
  let data = await use.select("*", "employee");
  if (a === 0) {
    a = data.length + 1;
  }
  await clear();
  console.log("");
  console.table(
    "Employees",
    data.filter((e) => data.indexOf(e) < a)
  );
  console.log("");
  console.log("");
  console.log("");
  return false;
}

async function showDepartment() {
  data = await use.select("*", "department");
  await clear();
  result = [];
  for (let i = 0; i < data.length; i++) {
    element = data[i];
    let table = await use.select(
      "employee.*",
      `employee JOIN role ON employee.role_id=role.id JOIN department ON department.id = role.department_id WHERE department.id = ${element.id}`
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
  await clear();
  result = [];

  for (let i = 0; i < data.length; i++) {
    element = data[i];
    let table = await use.select("*", "employee", "role_id", element.id);
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
      await showAll(10);
    }

    let ans = await inquirer.prompt(que.views);
    await clear();
    switch (ans.views) {
      case "e":
        return viewEmployee(await showAll());
      case "d":
        return viewEmployee(await showDepartment());
      case "r":
        return viewEmployee(await showRole());
      default:
        return "Returned from show";
    }
  }
}

module.exports = viewEmployee;
