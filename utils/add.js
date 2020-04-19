const inquirer = require("inquirer");
const Use = require("../db/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function exists(check, cb, sel, frm, wh1, wh2 = check) {
  let result = 0;
  if (check === "+") {
    result = await cb();
  } else {
    const tmp = await use.select(sel, frm, wh1, wh2);
    result = tmp[0].id;
  }
  return result;
}

async function createRole() {
  const ans = await inquirer.prompt(que.roles);
  let row = { title: ans.title, salary: ans.salary };
  let sel = "id";
  let frm = "department";
  let wh = "name";
  let dep = ans.department.trim();
  row.department_id = await exists(dep, createDepartment, sel, frm, wh);
  await use.insert("role", row);
  const id = await use.select("LAST_INSERT_ID()");
  return Object.values(id[0])[0];
}

async function createDepartment() {
  const ans = await inquirer.prompt(que.departments);
  await use.insert("department", ans);
  const id = await use.select("LAST_INSERT_ID()");
  return Object.values(id[0])[0];
}

async function addEmployee() {
  let ans = await inquirer.prompt(que.credentials);
  let row = { first_name: ans.first_name, last_name: ans.last_name };
  let sel = "id";
  let frm = "role";
  let wh = "title";
  let role = ans.role.trim();
  let stats = {};
  Object.assign(stats, row);
  row.role_id = await exists(role, createRole, sel, frm, wh);
  let tmp = await use.select(wh, frm, sel, row.role_id);
  stats.role = tmp[0].title;
  await use.insert("employee", row);
  let id = await use.select("LAST_INSERT_ID()");
  id = Object.values(id[0])[0];
  ans = await inquirer.prompt(que.managers);

  let patt = /^[\d]+/g;
  let man_id = patt.exec(ans.manager)[0];
  tmp = await use.select("id, first_name, last_name", "employee", "id", man_id);
  row = { manager_id: man_id };
  await use.update("employee", row, "id", id);
  let action = Object.values(tmp[0]).reduce((a, x) => a + ` ${x}`);
  stats.manager = `\n\nManager: ${action}`;
  action = Object.values(stats).reduce((a, x) => a + ` ${x}`);
  return `Added employee: ${action}`;
}

module.exports = addEmployee;
