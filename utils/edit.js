const inquirer = require("inquirer");
const Use = require("../db/sql");
const use = new Use();
const Que = require("./questions");
const que = new Que();
const Clear = require("./clear");
const clear = new Clear();

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function employee(id) {
  await clear.clearScreen();
  const name = await use.select("*", "employee", "id", id);
  const role = await use.select("title", "role", "id", name[0].role_id);
  const man = await use.select(
    "id, first_name, last_name",
    "employee",
    "id",
    name[0].manager_id
  );
  let edit = new Que();
  let manstr = Object.values(man[0]).reduce((a, x) => a + ` ${x}`);
  let show = {
    first_name: name[0].first_name,
    last_name: name[0].last_name,
    role: `Role: ${role[0].title}`,
    manager: `\n\nManager: ${manstr}`,
  };
  editing = Object.values(show).reduce((a, x) => a + ` ${x}`);
  console.log(`Editing:\nEmployee: ${editing}\n\n`);
  edit.credentials[0].default = name[0].first_name;
  edit.credentials[1].default = name[0].last_name;
  edit.credentials[2].source = (ans, input) =>
    use.check(input, "title", "role");
  let ans = await inquirer.prompt([...edit.credentials, ...edit.managers]);
  let patt = /^[\d]+/g;
  const man_id = parseInt(patt.exec(ans.manager)[0]);
  const role_id = await use.select("id", "role", "title", ans.role);
  let row = {
    first_name: ans.first_name,
    last_name: ans.last_name,
    role_id: role_id[0].id,
    manager_id: man_id,
  };
  await use.update("employee", row, "id", id);
  return false;
}

async function editDepartment(check = false) {
  if (!(typeof check.then === "function")) {
    await clear.clearScreen();
    let ans = await inquirer.prompt(que.edit_department);
    switch (ans.edit) {
      case "Return":
        return false;
      default:
        console.log(ans);
    }
  }
}

async function role(id) {
  await clear.clearScreen();
  const role = await use.select("*", "role", "id", id);
  const dep = await use.select(
    "name",
    "department",
    "id",
    role[0].department_id
  );
  let show = {
    title: role[0].title,
    salary: `Salary: ${role[0].salary}`,
    department_id: `Department: ${dep[0].name}`,
  };
  editing = Object.values(show).reduce((a, x) => a + ` ${x}`);
  console.log(`Editing:\nRole: ${editing}\n\n`);
  let edit = new Que();
  edit.roles[0].default = role[0].title;
  edit.roles[1].default = role[0].salary;
  edit.roles[2].source = (ans, input) => use.check(input, "name", "department");
  let ans = await inquirer.prompt(edit.roles);
  const dep_id = await use.select("id", "department", "name", ans.department);
  let row = {
    title: ans.title,
    salary: ans.salary,
    department_id: dep_id[0].id,
  };
  await use.update("role", row, "id", id);
}

async function editRole(check = false) {
  if (!(typeof check.then === "function")) {
    await clear.clearScreen();
    let ans = await inquirer.prompt(que.edit_role);
    switch (ans.edit) {
      case "Return":
        return false;
      default:
        let patt = /^[\d]+/g;
        let id = patt.exec(ans.edit)[0];
        return editRole(await role(id));
    }
  }
}

async function editEmployee(check = false) {
  if (!(typeof check.then === "function")) {
    await clear.clearScreen();
    let ans = await inquirer.prompt(que.edit_employee);
    switch (ans.edit) {
      case "Return":
        return false;
      default:
        let patt = /^[\d]+/g;
        let id = patt.exec(ans.edit)[0];
        return editEmployee(await employee(id));
    }
  }
}

async function selectEdit(check = false) {
  if (!(typeof check.then === "function")) {
    await clear.clearScreen();
    let ans = await inquirer.prompt(que.edits);
    switch (ans.views) {
      case "e":
        return selectEdit(await editEmployee());
      case "r":
        return selectEdit(await editRole());
      case "d":
        return selectEdit(await editDepartment());
      default:
        return "Returned from edit";
    }
  }
}
module.exports = selectEdit;
