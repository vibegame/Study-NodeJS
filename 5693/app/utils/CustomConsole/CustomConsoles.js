const colors = require('./colors');

class CustomConsoles {

    static createConsoleWithColors = (...options) => (str) => {
        console.log(...options, str, colors.Reset);
    };

    static info = this.createConsoleWithColors(colors.fg.Blue);

    static success = this.createConsoleWithColors(colors.fg.Green);

    static secondary = this.createConsoleWithColors(colors.fg.Magenta);

    static warn = this.createConsoleWithColors(colors.fg.Yellow);

    static error = this.createConsoleWithColors(colors.fg.Red);
}

module.exports = {
    CustomConsoles
};
