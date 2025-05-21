const os = require("os");

let win = tsgui.window({
    "title": "TSGui informations",
    "content": `TSGui version 2.0
Version name : Penguin

Creator : Leonardo Pinezi 2025
Repository : https://rb.gy/kzhw8w
OS name : ${os.type()}
OS plataform : ${os.platform()}`
}, screen);