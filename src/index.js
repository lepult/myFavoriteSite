import './app.scss';
import 'whatwg-fetch';

let fetchSitesCounter = 0;
let searchFilter = 'Ahaus';
let myVar;

const addOtherEventListeners = () => {
    document.querySelector('.extendButton').addEventListener('click', () => { extendWebsiteList(); });
    document.querySelector('.formButton').addEventListener('click', () => { sendFormInput(); });
    document.querySelector('.searchInput').addEventListener('input', () => { searchSetTimeout(); });
};

// Dynamic Input
const dynamicInputAddEventListeners = () => {
    const dynamicInputs = document.querySelectorAll('.dynamicInput');
    for (let i = 0; i < dynamicInputs.length; i += 1) {
        dynamicInputs[i].children[0].addEventListener('input', () => { inputDynamicInput(dynamicInputs[i]); });
        // tests for initial input
        inputDynamicInput(dynamicInputs[i]);
    }
};
const inputDynamicInput = (dynamicInput) => {
    if (dynamicInput.children[0].value) {
        dynamicInput.classList.add('labelRight');
    } else {
        dynamicInput.classList.remove('labelRight');
    }
};

// Websites List
const fetchSitesData = async (skip, take) => {
    chayns.showWaitCursor();
    try {
        const response = await fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${searchFilter}&Skip=${skip}&Take=${take}`);
        const json = await response.json();
        console.log('parsed json', json);
        chayns.hideWaitCursor();
        return json;
    } catch (ex) {
        console.log('parsing failed', ex);
        chayns.hideWaitCursor();
        return null;
    }
};
const createSiteList = async (sites) => {
    for (let i = 0; i < sites.length; i += 1) {
        const websiteIconContainer = document.createElement('div');
        const websiteIconLink = document.createElement('a');

        const websiteIcon = document.createElement('div');

        const websiteName = document.createElement('div');

        websiteIconContainer.classList.add('websiteIconContainer');
        websiteIconLink.classList.add('websiteIconLink');
        websiteIcon.classList.add('websiteIcon');
        websiteName.classList.add('websiteName');

        websiteName.innerHTML = sites[i].appstoreName;
        websiteIconLink.addEventListener('click', () => { chayns.openUrlInBrowser(`https://chayns.net/${sites[i].siteId}`); });

        try {
            // eslint-disable-next-line no-await-in-loop
            await fetch(`https://sub60.tobit.com/l/${sites[i].locationId}?size=65`);
            websiteIcon.style = `background-image: url(https://sub60.tobit.com/l/${sites[i].locationId}?size=65)`;
        } catch {
            websiteIcon.style = 'background-image: url(https://sub60.tobit.com/l/152342?size=65)';
        }

        document.querySelector('.websiteList').appendChild(websiteIconContainer);
        websiteIconContainer.appendChild(websiteIconLink);
        websiteIconLink.appendChild(websiteIcon);
        websiteIconContainer.appendChild(websiteName);
    }
};
const extendWebsiteList = async (list) => {
    document.querySelector('.extendButton').classList.add('hidden');
    const sites = await fetchSitesData(20 * fetchSitesCounter, 21);
    document.querySelector('.extendButton').classList.remove('hidden');
    document.querySelector('.accordion').classList.remove('hidden');

    if (sites.Data) {
        if (!sites.Data[20]) {
            document.querySelector('.extendButton').classList.add('hidden');
        } else {
            sites.Data.length = 20;
            document.querySelector('.extendButton').classList.remove('hidden');
        }
        if (list) {
            // eslint-disable-next-line no-restricted-syntax
            for await (const item of list) {
                item.remove();
            }
        }
        createSiteList(sites.Data);
        fetchSitesCounter += 1;
    }
};

// Search Input
const searchText = async () => {
    let newSearchFilter = document.querySelector('.searchInput').value;

    if (!newSearchFilter) {
        newSearchFilter = 'Ahaus';
    }
    if (newSearchFilter !== searchFilter) {
        searchFilter = newSearchFilter;
        const list = await Promise.all(document.querySelector('.websiteList').children);
        fetchSitesCounter = 0;
        extendWebsiteList(list);
    }
};
const searchSetTimeout = () => {
    clearTimeout(myVar);
    myVar = setTimeout(() => { searchText(); }, 500);
};

// Form
const formInitialFunction = () => {
    // Autofill First & Last Name
    if (chayns.env.user.isAuthenticated) {
        document.querySelector('.Vorname').value = chayns.env.user.firstName;
        document.querySelector('.Nachname').value = chayns.env.user.lastName;
    }
    //
    const inputs = document.querySelectorAll('.mandatory');
    for (let i = 0; i < inputs.length; i += 1) {
        formTestForInput(inputs[i]);
    }
};
const formAddEventListeners = () => {
    const inputs = document.querySelectorAll('.mandatory');

    for (let i = 0; i < inputs.length; i += 1) {
        inputs[i].children[0].addEventListener('input', () => { formTestForInput(inputs[i]); });
    }
};
const formTestForInput = (input) => {
    // Tests an Input Element for Input
    if (!input.children[0].value) {
        input.children[1].classList.add('formInputMissing');
    } else if (input.children[0].value) {
        input.children[1].classList.remove('formInputMissing');
    }
    // Sets Transparency of button
    setTransparencyOfButton();
};
const setTransparencyOfButton = () => {
    const vorname = document.querySelector('.Vorname').value;
    const nachname = document.querySelector('.Nachname').value;
    const email = document.querySelector('.E-Mail').value;
    const link = document.querySelector('.Link').value;
    const button = document.querySelector('.formButton');
    if (vorname && nachname && email && link && button.classList.contains('grey')) {
        button.classList.remove('grey');
    } else if (!vorname || !nachname || !email || !link) {
        button.classList.add('grey');
    }
};
const sendFormInput = () => {
    if (chayns.env.user.isAuthenticated) {
        // saves Inputs
        const vorname = document.querySelector('.Vorname').value;
        const nachname = document.querySelector('.Nachname').value;
        const plz = document.querySelector('.PLZ').value;
        const stadt = document.querySelector('.Stadt').value;
        const straße = document.querySelector('.Straße').value;
        const email = document.querySelector('.E-Mail').value;
        const link = document.querySelector('.Link').value;
        const anmerkungen = document.querySelector('.Anmerkungen').value;

        // tests for mandatory inputs
        if (vorname && nachname && email && link) {
            chayns.intercom.sendMessageToPage({
                text: `Name: ${vorname} ${nachname} \nEmail: ${email} \nAdresse: ${straße} ${plz} ${stadt} \nSeite: ${link} \n${anmerkungen}`
            }).then((data) => {
                if (data.status === 200) {
                    chayns.dialog.alert('', 'Wir haben Deine Anfrage erhalten.').then(console.log);

                    // resets all inputs except for first and last name
                    document.querySelector('.PLZ').value = null;
                    document.querySelector('.Stadt').value = null;
                    document.querySelector('.Straße').value = null;
                    document.querySelector('.E-Mail').value = null;
                    document.querySelector('.Link').value = null;
                    document.querySelector('.Anmerkungen').value = null;
                }
                inputDynamicInput(document.querySelector('.PLZ').parentElement);
                inputDynamicInput(document.querySelector('.Stadt').parentElement);
                inputDynamicInput(document.querySelector('.Straße').parentElement);

                inputDynamicInput(document.querySelector('.E-Mail').parentElement);
                inputDynamicInput(document.querySelector('.Link').parentElement);

                document.querySelector('.Link').parentElement.children[1].classList.add('formInputMissing');
                document.querySelector('.E-Mail').parentElement.children[1].classList.add('formInputMissing');
            });
        }
    } else {
        loginAndSend();
    }
};
function loginAndSend() {
    // optional -> prevents site reload
    chayns.addAccessTokenChangeListener(() => {
        console.log('login successful');
        sendFormInput();
    });
    // no reload tapp after login
    chayns.login();
}

const init = async () => {
    try {
        await chayns.ready;
        chayns.ui.accordion.init();
    } catch (err) {
        console.error('No chayns environment found', err);
    }

    addOtherEventListeners();
    // Initial Form Input Test
    formInitialFunction();
    // Adds event Listeners to Mandatory Input Fields
    formAddEventListeners();

    extendWebsiteList();

    dynamicInputAddEventListeners();
};

init();
