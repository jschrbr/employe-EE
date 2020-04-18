const figlet = require("figlet");
const util = require("util");
const inquirer = require("inquirer");
const readline = require("readline");
const add = require("./utils/add");
const show = require("./utils/show");
const edit = require("./utils/edit");
const get = require("./utils/get");
const bigPrint = util.promisify(figlet.text);

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// increase the limit
myEmitter.setMaxListeners(100);

const Use = require("./db/sql");
const use = new Use();
const Que = require("./utils/questions");
const que = new Que();

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

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

async function init(last_action) {
  if (!(typeof last_action.then === "function")) {
    await clearScreen();
    console.log(last_action);
    console.log("");
    console.log("");
    const ans = await inquirer.prompt(que.menu);

    await clearScreen();
    switch (ans.menu) {
      case "a":
        init(await add());
        break;
      case "s":
        init(await show(true));
        break;
      case "e":
        init(await edit());
        break;
      case "b":
        init(await get());
        break;
      case "x":
        console.clear();
        use.exit();
        process.exit;
        break;
      default:
        break;
    }
  }
}
init("Employ-EE has started");
