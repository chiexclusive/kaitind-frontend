const bcrypt = require("bcrypt");
async function test() {
    const salt = await bcrypt.genSalt(64);
    const hash = await bcrypt.hash("sfsdfdfsd", salt);
    console.log(hash);
}

test();