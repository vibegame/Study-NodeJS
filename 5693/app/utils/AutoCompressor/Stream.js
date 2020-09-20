class Stream {
    stream = [];

    run = async () => {
        while(this.stream.length) {
            await this.stream[0]()
            this.stream.shift();
        }
    };

    exec = (func) => {
        this.stream.push(func);
        if(this.stream.length === 1) {
            this.run();
        }
    };
}

module.exports = Stream;
