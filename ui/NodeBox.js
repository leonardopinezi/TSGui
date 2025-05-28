let hist = "";

let terminal = tsgui.window({
    "title":"NodeBox",
    "style": {
        bg: "#000"
    },
    "fit": true,
    scroll: false
}, screen);

let output = new blessed.log({
    parent: terminal,
    left: 0,
    top: 1,
    bottom: 1,
    scrollable: true,
    alwaysScroll: true,
    wrap: true,
    tags: true,
    style:{
        bg: "#000",
        fg: "#fff"
    }
})

let inputBar = new blessed.textbox({
    parent: terminal,
    left: 0,
    bottom: 0,
    width: "100%",
    height: 1,
    inputOnFocus: true,
    keys: true,
    mouse: true,
    style: {
        bg: "#000"
    }
});
inputBar.focus();

screen.render();

inputBar.key(["C-l"], ()=>{
    output.setContent("");
});

inputBar.on("submit", (line)=>{
    output.add(">" + line);
    hist += `${line}; `;
    inputBar.setValue("");

    line = line.trim();

    if(line === "exit") {
        terminal.destroy();
        screen.render();
        return;
    }

    if(line === "reset") {
        hist = "";
        inputBar.focus();
        return;
    }

    exec(`node -e "${hist.replaceAll('"','\\"')}"`, (err, stdout, stderr)=>{
        if (stdout) {
            output.add(`{green-fg}${stdout.trim()}{/green-fg}`);
        }
        if (stderr) {
            output.add(`{red-fg}${stderr.trim()}{/red-fg}`);
        }
        if (err) {
            output.add(`{red-fg}Execution Error: ${err.message.trim()}{/red-fg}`);
        }
    });
    
    screen.render();
    inputBar.focus();
});