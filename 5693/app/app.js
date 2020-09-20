const main = () => {
    const readline = require("readline");

    const {compress} = require('./utils/AutoCompressor/AutoCompressor');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = () => {
        rl.question("Enter the folder path:", async function (path) {
            try {
                await compress(path);
                rl.close();
            } catch (error) {
                question();
            }
        });
    };

    question();
};

main();




