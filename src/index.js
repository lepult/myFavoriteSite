/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import './app.scss';
import 'whatwg-fetch';

let fetchSitesCounter = 0;
let searchFilter = 'Ahaus';
let myVar;

const formTestForInitialInput = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const dynamicInput of document.querySelectorAll('.dynamicInput')) {
        // eslint-disable-next-line no-restricted-syntax
        formDynamicInput(dynamicInput);
        dynamicInput.children[0].addEventListener('input', () => { formDynamicInput(dynamicInput); });
        console.log(dynamicInput.children[0]);
    }
};
const formDynamicInput = (dynamicInput) => {
    if (dynamicInput.children[0].value) {
        dynamicInput.classList.add('labelRight');
    } else {
        dynamicInput.classList.remove('labelRight');
    }
};

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
    // eslint-disable-next-line no-restricted-syntax
    for (const site of sites) {
        const websiteIconContainer = document.createElement('div');
        const websiteIconLink = document.createElement('a');

        const websiteIcon = document.createElement('div');
        const websiteIconDef = document.createElement('div');

        const websiteName = document.createElement('div');

        websiteIconContainer.classList.add('websiteIconContainer');
        websiteIconLink.classList.add('websiteIconLink');
        websiteIcon.classList.add('websiteIcon');
        websiteIconDef.classList.add('websiteIconDef');
        websiteName.classList.add('websiteName');

        // websiteIcon.classList.add('background');
        // websiteIconDef.classList.add('background');

        websiteName.innerHTML = site.appstoreName;
        websiteIconLink.addEventListener('click', () => { chayns.openUrlInBrowser(`https://chayns.net/${site.siteId}`); });

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await fetch(`https://sub60.tobit.com/l/${site.locationId}?size=65`);
            websiteIcon.style = `background-image: url(https://sub60.tobit.com/l/${site.locationId}?size=65)`;
        } catch {
            websiteIcon.style = 'background-image: url(https://sub60.tobit.com/l/152342?size=65)';
        }

        // websiteIcon.style = `background-image: url(https://sub60.tobit.com/l/${site.locationId}?size=65)`;
        // websiteIconDef.style = 'background-image: url(https://sub60.tobit.com/l/152342?size=65)';

        document.querySelector('.websiteList').appendChild(websiteIconContainer);
        websiteIconContainer.appendChild(websiteIconLink);
        websiteIconLink.appendChild(websiteIconDef);
        websiteIconDef.appendChild(websiteIcon);
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

const searchText = async () => {
    let newSearchFilter = document.querySelector('.searchInput').value;

    if (!newSearchFilter) {
        newSearchFilter = 'Ahaus';
    }
    if (newSearchFilter !== searchFilter) {
        searchFilter = newSearchFilter;
        const list = await Promise.all(document.querySelector('.websiteList').children);
        // eslint-disable-next-line no-restricted-syntax
        fetchSitesCounter = 0;
        extendWebsiteList(list);
    }
};
const searchSetTimeout = () => {
    clearTimeout(myVar);
    myVar = setTimeout(() => { searchText(); }, 500);
};

const sendFormInput = () => {
    if (chayns.env.user.isAuthenticated) {
        // Name
        const vorname = document.querySelector('.Vorname').value;
        const nachname = document.querySelector('.Nachname').value;
        // Adresse
        const plz = document.querySelector('.PLZ').value;
        const stadt = document.querySelector('.Stadt').value;
        const straße = document.querySelector('.Straße').value;
        const email = document.querySelector('.E-Mail').value;
        // Seite
        const link = document.querySelector('.Link').value;
        const anmerkungen = document.querySelector('.Anmerkungen').value;
        if (vorname && nachname && email && link) {
            chayns.intercom.sendMessageToPage({
                text: `Name: ${vorname} ${nachname} \nEmail: ${email} \nAdresse: ${straße} ${plz} ${stadt} \nSeite: ${link} \n${anmerkungen}`
            }).then((data) => {
                if (data.status === 200) {
                    chayns.dialog.alert('', 'Wir haben Deine Anfrage erhalten.').then(console.log);

                    document.querySelector('.PLZ').value = null;
                    document.querySelector('.Stadt').value = null;
                    document.querySelector('.Straße').value = null;
                    document.querySelector('.E-Mail').value = null;
                    document.querySelector('.Link').value = null;
                    document.querySelector('.Anmerkungen').value = null;
                }
                formDynamicInput(document.querySelector('.PLZ').parentElement);
                formDynamicInput(document.querySelector('.Stadt').parentElement);
                formDynamicInput(document.querySelector('.Straße').parentElement);

                formTestForInput(document.querySelector('.E-Mail').parentElement);
                formDynamicInput(document.querySelector('.E-Mail').parentElement);
                formTestForInput(document.querySelector('.Link').parentElement);
                formDynamicInput(document.querySelector('.Link').parentElement);
            });
        }
    } else {
        login();
    }
};
const formAddEventListeners = () => {
    const inputs = document.querySelectorAll('.mandatory');

    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs) {
        input.children[0].addEventListener('input', () => { formTestForInput(input); });
    }
};
const formTestForInput = (input) => {
    if (!input.children[0].value) {
        input.children[1].classList.add('formInputMissing');
    } else if (input.children[0].value) {
        input.children[1].classList.remove('formInputMissing');
    }
    // Sets Transparency of button
    const vorname = document.querySelector('.Vorname').value;
    const nachname = document.querySelector('.Nachname').value;
    const email = document.querySelector('.E-Mail').value;
    const link = document.querySelector('.Link').value;
    const button = document.querySelector('.formButton');
    if (vorname && nachname && email && link) {
        button.classList.remove('grey');
    } else if (!vorname || !nachname || !email || !link) {
        button.classList.add('grey');
    }
};
const formInitialFunction = () => {
    if (chayns.env.user.isAuthenticated) {
        document.querySelector('.Vorname').value = chayns.env.user.firstName;
        document.querySelector('.Nachname').value = chayns.env.user.lastName;
    }


    const inputs2 = document.querySelectorAll('.mandatory');
    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs2) {
        formTestForInput(input);
    }
};
function login() {
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
    document.querySelector('.extendButton').addEventListener('click', () => { extendWebsiteList(); });
    document.querySelector('.formButton').addEventListener('click', () => { sendFormInput(); });

    document.querySelector('.searchInput').addEventListener('input', () => { searchSetTimeout(); });
    // Initial Form Input Test
    formInitialFunction();

    formAddEventListeners();

    extendWebsiteList();

    formTestForInitialInput();
};

init();
