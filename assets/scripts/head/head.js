// const loadHeadContent = (config) => {
//     fetch(config.filePath)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.text();
//         })
//         .then((content) => {
//             const headElement = document.querySelector(config.targetSelector);

//             if (!headElement) {
//                 throw new Error(`Target element "${config.targetSelector}" not found`);
//             }

//             headElement.innerHTML += content;
//             console.log(`Head content successfully loaded from ${config.filePath}`);
//         })
//         .catch((error) => {
//             console.error(`Failed to load head content: ${error.message}`);
//         });
// };

// const config = {
//     filePath: "/assets/scripts/head/head.html",
//     targetSelector: "head",
// };
// loadHeadContent(config);











const loadHeadContent = (config) => {
    fetch(config.filePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then((content) => {
            const headElement = document.querySelector(config.targetSelector);

            if (!headElement) {
                throw new Error(`Target element "${config.targetSelector}" not found`);
            }

            headElement.innerHTML += content;
            console.log(`Head content successfully loaded from ${config.filePath}`);

            // After loading head content, adjust the page title
            const titleElement = document.querySelector("title");

            if (titleElement) {
                const currentTitle = titleElement.textContent.trim();

                if (currentTitle) {
                    titleElement.textContent = `${currentTitle} | PowerPCFan's Website`;
                } else {
                    titleElement.textContent = "PowerPCFan's Website";
                }
            } else {
                const newTitle = document.createElement("title");
                newTitle.textContent = "PowerPCFan's Website";
                document.head.appendChild(newTitle);
            }
        })
        .catch((error) => {
            console.error(`Failed to load head content: ${error.message}`);
        });
};

const config = {
    filePath: "/assets/scripts/head/head.html",
    targetSelector: "head",
};
loadHeadContent(config);