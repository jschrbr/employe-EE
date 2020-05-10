const inquirer = require("inquirer");
const Use = require("../config/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const patt = /^([\+\d])+/g;

async function exists(check, cb) {
  let result = check;
  if (check === "+") {
    result = await cb();
  }
  return result;
}

async function createDepartment() {
  const ans = await inquirer.prompt(que.departments);
  return await use.insert("department", ans);
}

async function createRole() {
  const ans = await inquirer.prompt(que.roles);
  let row = { title: ans.title, salary: ans.salary };
  let dep = ans.department;
  const id = dep.exec(patt)[0];
  row.department_id = await exists(id, createDepartment);
  return await use.insert("role", row);
}

async function addEmployee() {
  let ans = await inquirer.prompt(que.credentials);
  let row = { first_name: ans.first_name, last_name: ans.last_name };
  let stats = {};
  Object.assign(stats, row);
  let role_id = ans.role.match(patt)[0];
  role_id = await exists(role_id, createRole);
  row.role_id = role_id;
  let id = await use.insert("employee", row);
  ans = await inquirer.prompt(que.managers);
  let man_id = patt.exec(ans.manager)[0];
  row = { manager_id: man_id };
  await use.update("employee", row, "id", id);

  let tmp = await use.select("title", "role", "id", role_id);
  stats.role = tmp[0].title;
  tmp = await use.select("id, first_name, last_name", "employee", "id", man_id);
  let action = Object.values(tmp[0]).reduce((a, x) => a + ` ${x}`);
  stats.manager = `\n\nManager: ${action}`;
  action = Object.values(stats).reduce((a, x) => a + ` ${x}`);
  return `Added employee: ${action}`;
}

module.exports = addEmployee;
