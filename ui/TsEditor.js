const fs = require('fs');
const blessed = require('blessed');
const tsgui = require('../tsgui-module');

function createTextEditor({ content = "", filename = "", screen }) {
    let lines = content.split('\n');
    let cursorX = 0;
    let cursorY = 0;

    const textEditor = [
        tsgui.window({ title: "TsEditor " + filename }, screen),
        blessed.box({
            left: 0,
            top: 0,
            width: 1,
            height: 1,
            style: {
                bg: "#ff0"
            },
            content: ""
        })
    ];

    textEditor[0].append(textEditor[1]);

    function updateContent() {
        textEditor[0].setContent(lines.join('\n'));
        textEditor[1].left = cursorX;
        textEditor[1].top = cursorY;
        screen.render();
    }

    textEditor[0].key(["C-s"], async () => {
        if (filename === "") {
            filename = Date.now() + ".txt";
            textEditor[0].setLabel("TsEditor " + filename);
            updateContent();
        }

        fs.writeFileSync(`./tsgui/${filename}`, lines.join("\n"), "utf8");
    });

    textEditor[0].key(["C-a"], async ()=>{
        const fname = await tsgui.prompt("Edit filename", "", screen);
    })

    textEditor[0].on("keypress", (ch, key) => {
        if (key.ctrl || key.meta) return;

        if (key.name === "right") {
            if (cursorX < (lines[cursorY] || '').length) cursorX++;
        } else if (key.name === "left") {
            if (cursorX > 0) cursorX--;
        } else if (key.name === "down") {
            if (cursorY < lines.length - 1) {
                cursorY++;
                cursorX = Math.min(cursorX, lines[cursorY].length);
            }
        } else if (key.name === "up") {
            if (cursorY > 0) {
                cursorY--;
                cursorX = Math.min(cursorX, lines[cursorY].length);
            }
        } else if (key.name === "backspace") {
            if (cursorX > 0) {
                lines[cursorY] = lines[cursorY].slice(0, cursorX - 1) + lines[cursorY].slice(cursorX);
                cursorX--;
            } else if (cursorY > 0) {
                cursorX = lines[cursorY - 1].length;
                lines[cursorY - 1] += lines[cursorY];
                lines.splice(cursorY, 1);
                cursorY--;
            }
        } else if (key.name === "enter") {
            const rest = lines[cursorY].slice(cursorX);
            lines[cursorY] = lines[cursorY].slice(0, cursorX);
            lines.splice(cursorY + 1, 0, rest);
            cursorY++;
            cursorX = 0;
        } else if (ch && ch !== '\r' && ch !== '\n') {
            lines[cursorY] = (lines[cursorY] || '').slice(0, cursorX) + ch + (lines[cursorY] || '').slice(cursorX);
            cursorX++;
        }

        updateContent();
    });

    updateContent();
    textEditor[0].focus();

    return textEditor[0];
}

module.exports = createTextEditor;