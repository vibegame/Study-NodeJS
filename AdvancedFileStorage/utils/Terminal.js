"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminal = void 0;
const chalk = require("chalk");
class Terminal {
    error(...args) {
        console.log(chalk.red(...args));
    }
    success(...args) {
        console.log("Terminal:", ...args.map((arg) => {
            if (typeof arg === "string") {
                return chalk.green(arg);
            }
            return arg;
        }));
    }
}
const terminal = new Terminal();
exports.terminal = terminal;
//# sourceMappingURL=Terminal.js.map