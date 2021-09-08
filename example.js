const {Client, serverStore} = require("./dist")
const client = new Client({
    token:
      "token here",
});

setTimeout(() => {
    console.log(serverStore().servers.value)
}, 5000);