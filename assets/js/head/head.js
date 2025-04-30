const loadHeadContent = async (config) => {
    try {
        const response = await fetch(config.filePath);

        if (!response.ok) {
            throw new Error(`HTTP error! Response code: ${response.status}`);
        }

        const content = await response.text();

        const headElement = document.querySelector(config.targetSelector);
        if (!headElement) {
            throw new Error(`Target element "${config.targetSelector}" not found`);
        }

        headElement.innerHTML += content;

        try {
            const titleElement = document.querySelector("title");

            if (titleElement) {
                const currentTitle = titleElement.textContent.trim();
                titleElement.textContent = currentTitle ? `${currentTitle} | PowerPCFan's Website` : "PowerPCFan's Website";
            } else {
                const newTitle = document.createElement("title");
                newTitle.textContent = "PowerPCFan's Website";
                document.head.appendChild(newTitle);
            }
        } catch (titleError) {
            console.error(`Failed to set page title: ${titleError.message}`);
        }

        console.log(`Head content successfully injected from "${config.filePath}"!`);
    } catch (error) {
        console.error(`Failed to load head content: ${error.message}`);
    }
};

loadHeadContent({
    filePath: "/assets/js/head/head.html",
    targetSelector: "head"
});
