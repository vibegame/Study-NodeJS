import * as chalk from 'chalk';

class Terminal {
    error(...args:unknown[]) {
        // eslint-disable-next-line no-console
        console.log(chalk.red(...args));
    }

    success(...args:unknown[]) {
        // eslint-disable-next-line no-console
        console.log("Terminal:", ...args.map((arg) => {
            if(typeof arg === "string") {
                return chalk.green(arg);
            }

            return arg;
        }));
    }
}

const terminal = new Terminal();

export {terminal};
