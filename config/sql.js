const mysql = require("mysql");
const util = require("util");
const _ = require("lodash");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db",
});

const query = util.promisify(connection.query).bind(connection);

connection.connect(function (err) {
  if (err) throw err;
});

async function querySel(a, b = 0, c = 0, d = 0) {
  let qry = "";
  if (b === 0 && c === 0 && d === 0) {
    qry = `SELECT ${a}`;
  } else if (c === 0 && d === 0) {
    qry = `SELECT ${a} FROM ${b}`;
  } else {
    qry = `SELECT ${a} FROM ${b} WHERE ${c}="${d}"`;
  }
  const get = await query(qry);
  results = [];
  get.forEach((element) => {
    results.push(element);
  });
  return results;
}

async function queryDel(a, b, c) {
  qry = `DELETE FROM ${a} WHERE ${b}=${c}`;
  return await query(qry);
}

async function queryIns(a, b, c = 0, d = 0) {
  let qry = "";
  if (c === 0 && d === 0) {
    qry = `INSERT INTO ${a} SET ?`;
  } else {
    qry = `INSERT INTO ${a} SET ? WHERE ${c}=${d}`;
  }
  await query(qry, [b]);
  const id = await querySel("LAST_INSERT_ID()");
  return Object.values(id[0])[0];
}

async function queryUpd(a, b, c, d) {
  qry = `UPDATE ${a} SET ? WHERE ${c}=${d}`;
  await query(qry, [b]);
}

async function queryChk(input, a, b, c = 0) {
  opt = await querySel(a, b);
  results = [];
  opt.forEach((element) => {
    let str = "";
    check = Object.values(element);
    check.forEach((element) => {
      str += `${element} `;
    });
    results.push(str);
  });

  if (c !== 0) {
    results.unshift(`${c}`);
  }
  input = input || "";
  return new Promise(function (resolve) {
    setTimeout(function () {
      var fuzzyResult = fuzzy.filter(input, results);
      resolve(
        fuzzyResult.map(function (el) {
          return el.original;
        })
      );
    }, _.random(30, 500));
  });
}

function Use() {}

Use.prototype.select = function (a, b, c, d) {
  return querySel(a, b, c, d);
};

Use.prototype.insert = function (a, b, c, d) {
  return queryIns(a, b, c, d);
};

Use.prototype.update = function (a, b, c, d) {
  queryUpd(a, b, c, d);
  return;
};

Use.prototype.remove = function (a, b, c) {
  return queryDel(a, b, c);
};

Use.prototype.check = function (a, b, c, d) {
  return queryChk(a, b, c, d);
};

Use.prototype.exit = () => connection.end();

module.exports = Use;
