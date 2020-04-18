const inquirer = require("inquirer");
const Use = require("../db/sql");
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
      source: (ans, input) => use.check(input, "title", "role", "+"),
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
      source: (ans, input) => use.check(input, "name", "department", "+"),
    },
  ];

  departments = [
    {
      type: "input",
      name: "name",
      message: "What's the department's title: ",
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

  views = [
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
          name: "By role",
          value: "r",
        },
        {
          name: "By department",
          value: "d",
        },
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
          name: "Return",
          value: "x",
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
        use.check(input, "id, first_name, last_name", "employee", "Return"),
    },
  ];

  edit_role = [
    {
      type: "autocomplete",
      name: "edit",
      message: "Choose an role to edit : ",
      source: (ans, input) => use.check(input, "id, title", "role", "Return"),
    },
  ];

  edit_department = [
    {
      type: "autocomplete",
      name: "edit",
      message: "Choose an department to edit : ",
      source: (ans, input) => use.check(input, "name", "department", "Return"),
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
