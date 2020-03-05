const HOST = "http://192.168.65.111:1080";

const URLS = {
    GET_VARIANTS: "/variants",
    GET_STATS: "/stats",
    VOTE: "/vote",
    GET_QUESTION: "/question"
};

class Api {

    getVariantsDB = async () => {
        const data = await fetch(`${HOST}${URLS.GET_VARIANTS}`)
        .then(response => response.json())
        .catch(error => console.error(error));

        console.log("%cGET Variants", "color: purple;");

        return data;

    };

    getQuestionDB = async () => {
        const data = await fetch(`${HOST}${URLS.GET_QUESTION}`)
        .then(response => response.text())
        .catch(error => console.error(error));

        console.log("%cGET Question", "color: purple;");

        return data;
    };

    getStatsDB = async () => {
        const data = await fetch(`${HOST}${URLS.GET_STATS}`)
        .then(response => response.json())
        .catch(error => console.error(error));

        console.log("%cGET Stats", "color: purple;");

        return data;
    };

    voteDB = async (vote) => {

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

    };

}

const api = new Api();
