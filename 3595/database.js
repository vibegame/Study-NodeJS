const fs = require('fs');
const path = require('path');

const databaseFile = path.join(__dirname, 'data.json');

const get = () => {

    let data = '';

    try {
        data = fs.readFileSync(databaseFile, "utf8");
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFile(databaseFile, "", function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
              });
        } 
        else {
            throw err;
        }
    }
    return data ? JSON.parse(data) : {};
};

const DATABASE = get();

const update = () => {
    fs.writeFileSync(databaseFile, JSON.stringify(DATABASE));
};

module.exports = {
    data: DATABASE,
    update
}