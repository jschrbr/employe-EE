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
  await clear.clearScreen();
  return false;
}

async function editEmployee(check = false) {
  if (!(typeof check.then === "function")) {
    let ans = await inquirer.prompt(que.edit_employee);
    switch (ans.edit) {
      case "Return":
        return false;
      default:
        let patt = /^[\d]+/g;
        let id = patt.exec(ans.edit)[0];
        await clear.clearScreen();
        return editEmployee(await employee(id));
    }
  }
}

async function selectEdit(check = false) {
  if (!(typeof check.then === "function")) {
    let ans = await inquirer.prompt(que.edits);
    switch (ans.views) {
      case "e":
        return selectEdit(await editEmployee());
      case "d":
        return selectEdit(await editDepartment());
      case "r":
        return selectEdit(await editRole());
      default:
        return "Returned from edit";
    }
  }
}
module.exports = selectEdit;
