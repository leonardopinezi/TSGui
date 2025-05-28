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
            alwaysScroll: data.scroll || true,
            scrollable: data.scroll || true,
            tags: true,
            wrap: data.fit || false,
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

        win.focus();

        return win;
    },

    prompt: (title = "New prompt", entry = "", screen) => {
        return new Promise((resolve, reject) => {
            const prompt = blessed.prompt({
                parent: screen,
                top: "center",
                left: "center",
                height: "shrink",
                width: "50%",
                label: "PopBox",
                keys: true,
                mouse: true,
                border: "line",
                style: {
                    bg: '#111',
                    fg: 'white',
                    border: {
                        fg: '#ffffff'
                    }
                },
                draggable: true,
            });

            screen.append(prompt);

            prompt.input(title, entry, (err, value) => {
                prompt.destroy();
                screen.render();

                if (err) {
                    reject(new Error("Prompt cancelled or failed.")); // Ou resolve(null) se preferir
                } else {
                    resolve(value);
                }
            });

            prompt.focus();
            screen.render();
        });
    }
}