const blessed = require('blessed');
const fs = require("fs");
const path = require("path");
const os = require("os");

const { exec } = require("child_process");

const tsgui = require("./tsgui-module");
const createFileManager = require("./ui/TFiles");
const createTextEditor = require('./ui/TsEditor');

let pc_data = JSON.parse(fs.readFileSync("./configs.json", {encoding:"utf-8"}));

const defaultApps = {
  "TFiles" : ()=>{
    const fileManager = createFileManager(screen, homePath);
    screen.append(fileManager);
    screen.render();
  },
  "TsEditor": ()=>{
    createTextEditor({ content: '', filename: '', screen, homePath });
  }
}

const homePath = `/home/${os.userInfo().username}/`;
const files = fs.readdirSync(homePath);

const taskItems = fs.readdirSync(path.join(__dirname, "ui"));
taskItems.forEach((item, id) => {
  taskItems[id] = item.substring(0, item.length - 3);
});

const screen = blessed.screen({
  smartCSR: true,
  title: 'TSGUi Workspace',
  mouse: true,
  input: process.stdin,
  output: process.stdout
});

const background = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  style: {
    bg: `${pc_data.background}`
  }
});

const taskbar = blessed.list({
  top: 0,
  left: `${pc_data.taskbar_left}`,
  width: '15%',
  height: '100%',
  keys: true,
  mouse: true,
  items: taskItems,
  border: {
    type: 'line'
  },
  label: 'Apps',
  style: {
    bg: `${pc_data.taskbar}`,
    fg: `${pc_data.font_color}`,
    selected: {
      bg: `${pc_data.select_item}`,
      fg: `${pc_data.selected_font}`,
      bold: true
    },
    item: {
      hover: {
        bg: `${pc_data.highlight}`
      }
    },
    border: {
      fg: `${pc_data.border_color}`
    }
  },
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    bg: `${pc_data.scrollbar_bg}`
  }
});


taskbar.on("select", (item) => {
  const filepath = path.join(__dirname, `ui/${item.getText()}.js`);

  if (defaultApps[item.getText()]) {
    defaultApps[item.getText()]();
  } else {
    const script = fs.readFileSync(filepath, {encoding:"utf-8"});
    eval(script);
  }
});

screen.append(background);
screen.append(taskbar);
screen.render();
