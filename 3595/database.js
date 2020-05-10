const fs = require('fs');
const path = require('path');

const databaseFile = path.join(__dirname, 'data.json');

const get = () => {
    const response = fs.readFileSync(databaseFile, "utf8");
    return response ? JSON.parse(response) : {};
};

const DATABASE = get();

const update = () => {
    fs.writeFileSync(databaseFile, JSON.stringify(DATABASE));
};

module.exports = {
    data: DATABASE,
    update
}