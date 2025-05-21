const blessed = require('blessed');
const fs = require("fs");
const path = require("path");

module.exports = {
    window: (data, screen) => {
        const win = blessed.box({
            top: "center",
            left: 'center',
            width: data.width || '50%',
            height: data.height || '50%',
            keys: true,
            mouse: true,
            label: data.title || "New Window",
            content: data.content || "",
            lineWrap: false,
            tags: false,
            border: {
                type: 'line'
            },
            style: data.style || {
                border: {
                    fg: '#44475a'
                },
                bg: '#1e1e2e',
                fg: '#f8f8f2',
            },
            alwaysScroll: true,
            scrollable: true,
            tags: true,
            wrap: false,
            scrollbar: {
                ch: ' ',
                style: {
                    bg: '#44475a'
                }
            },
            draggable: true
        });

        const closeWindow = blessed.button({
            parent: win,
            top: 0,
            right: 0,
            width: 5,
            height: 1,
            content: ' ⨉ ',
            align: 'center',
            mouse: true,
            keys: true,
            style: {
                fg: '#ffffff',
                bg: '#ff5555',
                hover: {
                    bg: '#ff6e6e'
                },
                focus: {
                    bg: '#ff4444'
                }
            }
        });

        closeWindow.on("press", () => {
            win.destroy();
            screen.render();
        });

        screen.append(win);
        screen.render();

        return win;
    },
}