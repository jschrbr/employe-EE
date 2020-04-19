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

async function department(id) {
  await clear.clearScreen();
  const dep = await use.select("*", "department", "id", id);
  console.log(`Editing:\nDepartment: ${dep[0].name}\n\n`);
  let edit = new Que();
  edit.departments[0].default = dep[0].name;
  let ans = await inquirer.prompt(edit.departments);
  await use.update("department", ans, "id", id);
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

async function remove(id) {
  const emp = await use.select("*", "employee");
  let rmv = await use.select("*", "employee", "id", id);
  id = rmv[0].id;
  let role_id = rmv[0].role_id;
  let dep = true;
  let role = true;
  await use.remove("employee", "id", id);
  emp.forEach(async (element) => {
    if (element.manager_id === id) {
      let row = { manager_id: element.id };
      await use.update("employee", row, "id", element.id);
    }
    if (element.role_id === role_id && element.id !== id) {
      role = false;
    }
  });
  if (role) {
    role = await use.select("*", "role");
    rmv = await use.select("*", "role", "id", role_id);
    let dep_id = rmv[0].department_id;
    await use.remove("role", "id", role_id);
    role.forEach((element) => {
      if (element.department_id === dep_id && element.id !== role_id) {
        dep = false;
      }
    });
    if (dep) {
      await use.remove("department", "id", dep_id);
    }
  }
}

async function select(check = false, questions, cb) {
  if (!(typeof check.then === "function")) {
    await clear.clearScreen();
    let ans = await inquirer.prompt(questions);
    switch (ans.edit) {
      case "Return":
        return false;
      default:
        let patt = /^[\d]+/g;
        let id = patt.exec(ans.edit)[0];
        return select(await cb(id), questions, cb);
    }
  }
}

async function selectEdit(check = false) {
  if (!(typeof check.then === "function")) {
    await clear.clearScreen();
    let ans = await inquirer.prompt(que.edits);
    switch (ans.views) {
      case "e":
        return selectEdit(await select(false, que.edit_employee, employee));
      case "r":
        return selectEdit(await select(false, que.edit_role, role));
      case "d":
        return selectEdit(await select(false, que.edit_department, department));
      case "x":
        return selectEdit(await select(false, que.delete_employee, remove));
      default:
        return "Returned from editor";
    }
  }
}
module.exports = selectEdit;
