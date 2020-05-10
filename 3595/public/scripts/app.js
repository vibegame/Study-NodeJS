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


    variants.forEach(variantText => {
        const eVariant = renderVariant();
        eVariant.innerHTML = variantText;
        eVariant.addEventListener("click", event => {
            if(voteInfo.activeVariantElement) {
                voteInfo.activeVariantElement.classList.remove("active");
            }
            
            voteInfo.activeVariantElement = eVariant;
            voteInfo.currentVote = variantText;
            eVariant.classList.add("active");
        }) 
        variantsBlock.appendChild(eVariant);
    });

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
    });

    document.querySelector(".voteBlock").appendChild(button);
}; 

const renderDownloadStatsButton = async () => {

    const button = document.createElement("button");

    button.classList.add("downloadButton");

    button.innerHTML = "Get Stats";

    button.addEventListener("click", async event => {
        const data = await database.getStats();

        if(document.getElementById("textarea-stats")) {
            document.getElementById("textarea-stats").parentNode.removeChild(document.getElementById("textarea-stats"));
        }

        const translateData = (data) => {

            let str = "";
            for(let key in data) {
                const count = data[key];
                str += `${key} have ${count} vote(s) \n`;
            }

            return str;
        };

        const textarea = document.createElement("textarea");
        textarea.innerHTML = translateData(data);
        textarea.id = "textarea-stats";
        textarea.readOnly = true;
        textarea.style.resize = "none";
        textarea.style.height = "300px";

        document.querySelector(".voteBlock").appendChild(textarea);

    });

    document.querySelector(".voteBlock").appendChild(button);
};

(async function() {
    await renderQuestion();
    await renderVariants();
    await renderVoteButton();
    await renderDownloadStatsButton();
})();