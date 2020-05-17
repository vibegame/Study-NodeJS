const voteInfo = {
    currentVote: null,
    activeVariantElement: null
};

const renderQuestion = async () => {

    const eQuestion = document.querySelector(".voteBlockQuestion");
    const defaultText = "Waiting...";

    eQuestion.innerHTML = defaultText;

    await database.getQuestion().then(questionText => {
        eQuestion.innerHTML = questionText;
    })

};


const renderVariant = () => {
    const variant = document.createElement('div');
    variant.classList.add("variantsBlockItem");

    return variant;
};

const renderVariants = async () => {
    const variantsBlock = document.createElement('div');

    variantsBlock.classList.add("variantsBlock");

    const variants = await database.getVariants();

    for(let key in variants) {
        const variantText = variants[key];
        const eVariant = renderVariant();
        eVariant.innerHTML = variantText;
        eVariant.addEventListener("click", event => {
            if(voteInfo.activeVariantElement) {
                voteInfo.activeVariantElement.classList.remove("active");
            }
            
            voteInfo.activeVariantElement = eVariant;
            voteInfo.currentVote = key;
            eVariant.classList.add("active");
        }) 
        variantsBlock.appendChild(eVariant);
    }

    document.querySelector(".voteBlock").appendChild(variantsBlock);
};

const renderVoteButton = async () => {

    const button = document.createElement("button");
    button.classList.add("btnSubmit");
    button.innerHTML = "Vote";

    button.addEventListener("click", async event => {
        if(!voteInfo.currentVote) return;
        await database.vote(voteInfo.currentVote);

        if(voteInfo.activeVariantElement) {
            voteInfo.activeVariantElement.classList.remove("active");
        }

        voteInfo.currentVote = null;
        voteInfo.activeVariantElement = null;
        await renderStats();
    });

    document.querySelector(".voteBlock").appendChild(button);
}; 

const renderStats = async () => {

    const data = await database.getStats();

    const translateData = async (data) => {

        const variants = await database.getVariants();

        let str = "";
        for(let key in data) {
            const count = data[key];
            str += `${variants[key]} have ${count} vote(s) \n`;
        }

        return str;
    };

    if(document.getElementById('textarea-stats')) {
        const textarea = document.getElementById('textarea-stats');
        textarea.innerHTML = await translateData(data);
    } else {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = await translateData(data);
        textarea.id = "textarea-stats";
        textarea.readOnly = true;
        textarea.style.resize = "none";
        textarea.style.height = "300px";
        document.querySelector(".voteBlock").appendChild(textarea);
    }
};

const rerenderStats = async () => {
    

};

(async function() {
    await renderQuestion();
    await renderVariants();
    await renderVoteButton();
    await renderStats();
})();