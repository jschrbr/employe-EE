const inquirer = require("inquirer");
const Use = require("../config/sql");
const use = new Use();

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

class Que {
  menu = [
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
          name: "Show employees",
          value: "s",
        },
        {
          name: "Edit data",
          value: "e",
        },
        {
          name: "Show budgets",
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

  credentials = [
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
      source: (ans, input) => use.check(input, "id, title", "role", "+"),
    },
  ];

  roles = [
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
      source: (ans, input) => use.check(input, "id, name", "department", "+"),
    },
  ];

  departments = [
    {
      type: "input",
      name: "name",
      message: "What's the department's name: ",
    },
  ];

  managers = [
    {
      type: "autocomplete",
      name: "manager",
      message: "What's the manager's id: ",
      source: (ans, input) =>
        use.check(input, "id, first_name, last_name", "employee"),
    },
  ];

  show = [
    {
      type: "list",
      name: "views",
      choices: [
        {
          name: "By employee",
          value: "e",
        },
        {
          name: "By role",
          value: "r",
        },
        {
          name: "By department",
          value: "d",
        },
        new inquirer.Separator(),

        {
          name: "Return",
          value: "x",
        },
      ],
    },
  ];

  edits = [
    {
      type: "list",
      name: "views",
      message: "Choose what you'd like to edit: ",
      choices: [
        {
          name: "Employee",
          value: "e",
        },
        {
          name: "Role",
          value: "r",
        },
        {
          name: "Department",
          value: "d",
        },
        new inquirer.Separator(),
        {
          name: "Remove",
          value: "x",
        },
        {
          name: "Return",
          value: "b",
        },
      ],
    },
  ];

  edit_employee = [
    {
      type: "autocomplete",
      name: "edit",
      message: "Choose an employee to edit : ",
      source: (ans, input) =>
        use.check(
          input,
          "employee.id, employee.first_name, employee.last_name, role.title, department.name",
          "employee JOIN role ON employee.role_id=role.id JOIN department ON department.id=role.department_id",
          "Return"
        ),
    },
  ];

  edit_role = [
    {
      type: "autocomplete",
      name: "edit",
      message: "Choose an role to edit : ",
      source: (ans, input) =>
        use.check(
          input,
          "role.id, role.title, department.name",
          "role JOIN department ON department.id=role.department_id",
          "Return"
        ),
    },
  ];

  edit_department = [
    {
      type: "autocomplete",
      name: "edit",
      message: "Choose an department to edit : ",
      source: (ans, input) =>
        use.check(input, "id, name", "department", "Return"),
    },
  ];

  delete_employee = [
    {
      type: "autocomplete",
      name: "edit",
      message: "Choose an employee to delete : ",
      source: (ans, input) =>
        use.check(
          input,
          "employee.id, employee.first_name, employee.last_name, role.title, department.name",
          "employee JOIN role ON employee.role_id=role.id JOIN department ON department.id=role.department_id",
          "Return"
        ),
    },
  ];

  get = [
    {
      type: "autocomplete",
      name: "from",
      message: "Select a state to travel from",
      // source: function(answersSoFar, input) {
      //   return myApi.searchStates(input);
      // }
    },
  ];
}

module.exports = Que;
