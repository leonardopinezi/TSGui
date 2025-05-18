const blessed = require('blessed');
const fs = require("fs");
const path = require("path");

const createFileManager = require("./ui/files");

const homePath = path.join(__dirname, "tsgui");
const files = fs.readdirSync(homePath);

const taskItems = fs.readdirSync(path.join(__dirname, "ui"));
taskItems.forEach((item, id)=>{
    taskItems[id] = item.substring(0, item.length-3);
});

const screen = blessed.screen({
  smartCSR: true,
  title: 'TSGUi Workspace'
});

const background = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  style: {
    bg: 'blue'
  }
});

const taskbar = blessed.list({
  top: 0,
  left: 0,
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
    bg: 'black',
    fg: 'white',
    selected: {
      bg: 'cyan',
      fg: 'black',
      bold: true
    },
    item: {
      hover: {
        bg: 'gray'
      }
    },
    border: {
      fg: 'white'
    }
  },
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    bg: 'white'
  }
});

taskbar.on("select", (item)=>{
  const filepath = path.join(__dirname, `${item.getText()}.js`);

  if(item.getText() === "files") {
    const fileManager = createFileManager(screen, homePath);
    screen.append(fileManager);
    screen.render();
  }
});

screen.append(background);
screen.append(taskbar);

screen.key(['C-c'], () => process.exit(0));
screen.render();