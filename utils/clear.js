const figlet = require("figlet");
const util = require("util");
const bigPrint = util.promisify(figlet.text);
const readline = require("readline");

async function clear() {
  const blank = "\n".repeat(process.stdout.rows);
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

async function clearScreen() {
  data = await bigPrint("Employ-EE", {
    font: "Doom",
  });
  await clear();
  console.log(data);
  console.log("");
  console.log("");
  console.log("");
}

function Clear() {}

Clear.prototype.clear = () => clear();
Clear.prototype.clearScreen = () => clearScreen();

module.exports = Clear;
