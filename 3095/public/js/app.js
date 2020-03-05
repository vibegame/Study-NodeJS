(async () => {

    let state = {
        activeVote: null,
        stats: {},
        variants: [],
        question: ""
    };

    const renderStats = () => {


        const container = document.getElementById("stats");

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        state.variants.forEach(variant => {

            const wrapper = document.createElement('div');
            wrapper.classList.add("stats-wrapper");
            const row = document.createElement('div');
            row.classList.add("stats-row");
            const name = document.createElement('div');
            name.classList.add("stats-name");
            const value = document.createElement('div');
            value.classList.add("stats-value");

            name.textContent = variant;
            value.textContent = state.stats[variant];

            row.appendChild(name);
            row.appendChild(value);
            wrapper.appendChild(row);

            document.getElementById("stats").appendChild(wrapper);

        });


    };


    const render = () => {
        DOM_MODEL.question.textContent = state.question;
        DOM_MODEL.votes.forEach((element, index) => {

            const variant = element.getAttribute("data-variant");

            if(variant === state.activeVote) {
                element.classList.add("active");
            } 
            
            if(element.classList.contains("active") && variant !== state.activeVote){
                element.classList.remove("active");
            }

            element.textContent = state.variants[index];
        });

        if(Object.keys(state.stats).length) {
            renderStats();
        }
    };


    const setState = (newState) => {
        const keys = Object.keys(newState);

        for(let key of keys) {
            state[key] = newState[key];
        }

        render();
    };

    const onVote = async () => {

        await api.voteDB(state.activeVote);
        await onGetStats();

        setState({
            activeVote: null
        });

    };

    const onGetStats = async () => {
        const stats = await api.getStatsDB();

        setState({
            stats
        });
    };

    const getModelDOM = () => {


        const question = document.getElementById('question');
        const vote = document.getElementById('btn-vote');
        const getStats = document.getElementById('get-stats');
        const votes = [];

        vote.addEventListener("click", onVote);
        getStats.addEventListener("click", onGetStats);

        for(let i = 0; i < state.variants.length; i++) {
            const variant = document.createElement('div');
        
            variant.classList.add('variant');
            variant.setAttribute("data-variant", state.variants[i]);
            variant.addEventListener('click', () => {
                setState({
                    activeVote: state.variants[i]
                });
            });

            votes.push(variant);
        } 

        return ({
            question,
            votes,
            vote,
            getStats
        });

    };

    const generateState = (genState) => {

        state = {...genState};

    };

    const beforeMount = async () => {
        const question = await api.getQuestionDB();
        const variants = await api.getVariantsDB();
        generateState({
            question,
            variants,
            activeVote: null,
            stats: {}
        });
    };

    const mount = () => {

        const votesBlock = document.getElementById('votes');

        DOM_MODEL.votes.forEach(element => {

            votesBlock.appendChild(element);

        });
        

    };

    await beforeMount();

    const DOM_MODEL = getModelDOM();

    mount();

    render();
})(); 