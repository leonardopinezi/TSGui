const blessed = require('blessed');
const fs = require("fs");
const path = require("path");
const { spawn, exec } = require('child_process');
const tsgui = require("../tsgui-module");

const createTextEditor = require('./TsEditor');

function createFileManager(screen, homePath) {
    let _path = homePath;
    let files = ["..", ...fs.readdirSync(_path)];
    let file = undefined;

    const fileManager = blessed.list({
        top: 2,
        left: 'center',
        width: '50%',
        height: '50%',
        items: files,
        keys: true,
        mouse: true,
        label: _path,
        border: {
            type: 'line'
        },
        style: {
            border: {
                fg: '#44475a'
            },
            bg: '#1e1e2e',
            fg: '#f8f8f2',
            selected: {
                bg: '#6272a4',
                fg: '#ffffff',
                bold: true
            },
            item: {
                hover: {
                    bg: '#44475a'
                }
            }
        },
        alwaysScroll: true,
        scrollable: true,
        scrollbar: {
            ch: ' ',
            style: {
                bg: '#44475a'
            }
        },
        draggable: true
    });

    const closeWindow = blessed.button({
        parent: fileManager,
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
        fileManager.destroy();
        screen.render();
    });

    closeWindow.focus();
    screen.render();

    fileManager.key(["C-o"], () => {
        const filename = fileManager.getItem(fileManager.selected).getText();
        const filepath = path.join(_path, filename);
        if (fs.statSync(filepath).isFile()) {
            const content = fs.readFileSync(filepath, 'utf8');
            createTextEditor({ content: content, filename: filename, screen, _path });
        }
    });

    fileManager.key(["C-d"], () => {
        const filename = fileManager.getItem(fileManager.selected).getText();
        const filepath = path.join(_path, filename);
        if (fs.statSync(filepath).isFile()) {
            fs.unlinkSync(filepath);
            files = ["..", ...fs.readdirSync(_path)];
            fileManager.setItems(files);
            screen.render();
        }
    });

    fileManager.on('select', (item) => {
        const filename = item.getText();
        if (_path == "/home" && filename == "..") return;
        if (filename === "..") {
            _path = _path.substring(0, _path.lastIndexOf("/"));
            files = ["..", ...fs.readdirSync(_path)];
            fileManager.setItems(files);
            fileManager.setLabel(_path);
            screen.render();
        } else {
            const filepath = path.join(_path, filename);
            file = filepath;

            if (fs.statSync(filepath).isFile()) {
                const content = fs.readFileSync(filepath, 'utf8');
                if (!filename.endsWith(".js")) {
                    if (filename.endsWith(".sh") || filename.endsWith(".bash")) {
                        exec(`bash '${path.join(_path, filename)}'`, (err, stdout, stderr) => {
                            if (stdout) {
                                console.log(stdout);
                            }
                            if (stderr) {
                                console.log(stderr);
                            }
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        const viewer = blessed.box({
                            parent: screen,
                            top: 'center',
                            left: 'center',
                            width: '50%',
                            height: '50%',
                            content: content,
                            border: 'line',
                            scrollable: true,
                            keys: true,
                            mouse: true,
                            alwaysScroll: true,
                            label: `${filename}`,
                            style: {
                                fg: '#f8f8f2',
                                bg: '#282a36',
                                border: {
                                    fg: '#44475a'
                                },
                                scrollbar: {
                                    bg: '#44475a'
                                }
                            },
                            draggable: true
                        });

                        const closeButton = blessed.button({
                            parent: viewer,
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

                        closeButton.on("press", () => {
                            viewer.destroy();
                            fileManager.focus();
                            screen.render();
                        });

                        closeButton.focus();
                        screen.render();
                    }
                } else {
                    eval(content);
                }
            } else {
                _path = path.join(_path, filename);
                files = ["..", ...fs.readdirSync(_path)];
                fileManager.setItems(files);
                fileManager.setLabel(_path);
                screen.render();
            }
        }
    });

    return fileManager;
}

module.exports = createFileManager;
