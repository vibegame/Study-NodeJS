const isLocal = false;

const LOCALHOST = "http://localhost:1080";

const IPHOST = "http://192.168.65.111:1080";

const HOST = isLocal ? LOCALHOST : IPHOST;


const URLS = {
    GET_VARIANTS: "/variants",
    GET_STATS: "/stats",
    VOTE: "/vote",
    GET_QUESTION: "/question"
};

class Dbapi {
    async getVariants() {
        const data = await fetch(`${HOST}${URLS.GET_VARIANTS}`)
        .then(response => response.json())
        .catch(error => console.error(error));
        
        return data;
    }

    async getStats() {
        const data = await fetch(`${HOST}${URLS.GET_STATS}`, {
            "Content-Disposition": "attachment"
        })
        .then(response => response.json())
        .catch(error => console.error(error));
        
        return data;
    }

    async getQuestion() {
        const data = await fetch(`${HOST}${URLS.GET_QUESTION}`)
        .then(response => response.text())
        .catch(error => console.error(error));

        return data;
    }

    async vote(vote) {
        const data = {
            value: vote
        };

        await fetch(`${HOST}${URLS.VOTE}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });
    }
}

const database = new Dbapi();
