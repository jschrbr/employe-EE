var mysql = require("mysql");
const util = require("util");

var connection = mysql.createConnection({
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

async function queryIns(a, b, c = 0, d = 0) {
  let qry = "";
  if (c === 0 && d === 0) {
    qry = `INSERT INTO ${a} SET ?`;
  } else {
    qry = `INSERT INTO ${a} SET ? WHERE ${c}=${d}`;
  }
  await query(qry, [b]);
}

async function queryUpd(a, b, c, d) {
  qry = `UPDATE ${a} SET ? WHERE ${c}=${d}`;
  await query(qry, [b]);
}

function Use() {}

Use.prototype.select = function (a, b, c, d) {
  return querySel(a, b, c, d);
};

Use.prototype.insert = function (a, b, c, d) {
  queryIns(a, b, c, d);
  return;
};
Use.prototype.update = function (a, b, c, d) {
  queryUpd(a, b, c, d);
  return;
};

Use.prototype.exit = () => connection.end();

module.exports = Use;
