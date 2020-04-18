const inquirer = require("inquirer");
const add = require("./utils/add");
const show = require("./utils/show");
const edit = require("./utils/edit");
const get = require("./utils/get");

const Use = require("./db/sql");
const use = new Use();
const Que = require("./utils/questions");
const que = new Que();
const Clear = require("./utils/clear");
const clear = new Clear();

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function init(last_action) {
  if (!(typeof last_action.then === "function")) {
    await clear.clearScreen();
    console.log(last_action);
    console.log("");
    console.log("");
    const ans = await inquirer.prompt(que.menu);

    await clear.clearScreen();
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
