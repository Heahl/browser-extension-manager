"use strict";


window.addEventListener('load', init);



async function init(){
    try {
        const extensions = await fetchExtensionData();
        renderExtensions(extensions);

    }catch (e){
        console.error(`Failed to initialize: ${e.message}`);
    }

    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if(darkModeToggle){
    darkModeToggle.addEventListener('click', function(){
        const isDark = document.body.classList.contains('dark-mode');
       if(!isDark){
           enableDarkMode();
       } else {
           disableDarkMode();
       }

    });
    }
}

async function fetchExtensionData(){
    try{
        const response = await fetch("public/data/data.json");
        if (!response.ok){
            throw new Error(`Response status: ${response.statusText} (${response.status})`);
        }
        return await response.json();
    }catch (e){
        throw new Error(`Problem with the JSON data: ${e.message}`);
    }
}

function renderExtensions(extensions){
    const container = document.querySelector('.extensions-container');
    const template = document.getElementById('extension-container');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterInactive = document.getElementById('filter-inactive');
     if (!container){
         console.error("No container found for the template!");
         return;
     }
     if (!template){
         console.error('No template found!');
         return;
     }

     function renderExtensionList(extensionList){
     container.replaceChildren();

    extensionList.forEach(extension =>{
        const clone = template.content.cloneNode(true);

        //console.log(`Clone: ${clone}`);
        const extImage = clone.querySelector('.extension-image');
        const extTitle = clone.querySelector('.extension-title');
        const extText = clone.querySelector('.extension-text');
        const isActiveToggle = clone.querySelector('.toggle-extension');
        const removeBtn = clone.querySelector('.remove-extension');

        //console.log(`extImage: ${extImage}, extTitle: ${extTitle}, extText: ${extText}, isActiveToggle: ${isActiveToggle}`);
        if (extImage){
            extImage.src = extension.logo;
            extImage.alt = `${extension.name} Logo`;
        }
        if (extTitle){
            extTitle.textContent = extension.name;
        }
        if (extText){
            extText.textContent = extension.description;
        }
        if (isActiveToggle){
            //console.log(`Setting initial state for ${extension.name}: data.isActive = ${extension.isActive}, type = ${typeof extension.isActive}`);
            isActiveToggle.checked = extension.isActive;
            //console.log(`Set element.checked to: ${isActiveToggle.checked}`);
            isActiveToggle.dataset.extensionName = extension.name;

            isActiveToggle.addEventListener('change', async function(){
                const name = this.dataset.extensionName;
                const newState = this.checked;
                console.log(`Toggle changed for ${name}, new state: ${newState}`);
            })
        }
        if(removeBtn){
            removeBtn.addEventListener('click', function(){
                const itemElement = this.closest('.extension-content');
                if(itemElement){
                    itemElement.remove();
                    console.log(`Extension ${extension.name} removed from DOM.`);
                }
            })
        }
        container.appendChild(clone);
    });
     }
     const renderAll =()=>renderExtensionList(extensions);
     const renderActive=()=>renderExtensionList(extensions.filter(extension=>extension.isActive===true));
     const renderInactive =()=> renderExtensionList(extensions.filter(extension=>extension.isActive===false));

     filterAll.classList.add('active-filter');
     const icon = document.getElementById('dark-mode-icon');
     if (icon){
         icon.src = "public/images/icon-moon.svg";
         icon.alt = "Toggle Dark Mode"
     }

     function setActiveFilter(activeButton){
         [filterAll,filterActive,filterInactive].forEach(btn=>{
             btn.classList.remove('active-filter');
         });
         activeButton.classList.add('active-filter');
     }
    filterAll.addEventListener('click', () => { setActiveFilter(filterAll); renderAll(); });
    filterActive.addEventListener('click', () => { setActiveFilter(filterActive); renderActive(); });
    filterInactive.addEventListener('click', () => { setActiveFilter(filterInactive); renderInactive(); });

     renderAll();
}

function enableDarkMode(){
    const icon = document.getElementById('dark-mode-icon');
    if (icon){
    icon.src = "public/images/icon-sun.svg";
    icon.alt = "Toggle Light Mode";
    }
    document.body.classList.add('dark-mode');

}
function disableDarkMode(){
    const icon = document.getElementById('dark-mode-icon');
    if (icon){
        icon.src = "public/images/icon-moon.svg";
        icon.alt = "Toggle Dark Mode";
    }
    document.body.classList.remove('dark-mode');
}