/* eslint-disable no-param-reassign */
import './app.scss';
import 'whatwg-fetch';

let fetchSitesCounter = 0;
const formRealignPlaceholder = () => {
    for (let i = 0; i < document.getElementsByClassName('formInput').length; i += 1) {
        // if (document.getElementById(`${i}`).value) {
            document.getElementsByClassName('formInput')[i].classList.add('labelRight');
    }
};
const fetchSitesData = async (skip, take) => {
    try {
        const response = await fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=ahaus&Skip=${skip}&Take=${take}`);
        const json = await response.json();
        console.log('parsed json', json);
        return json;
    } catch (ex) {
        console.log('parsing failed', ex);
    }
};
const createSiteList = (sites) => {
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
        websiteIcon.style = `background-image: url(https://sub60.tobit.com/l/${site.locationId}?size=65)`;
        websiteIconDef.style = 'background-image: url(https://sub60.tobit.com/l/152342?size=65)';

        document.querySelector('.websiteList').appendChild(websiteIconContainer);
        websiteIconContainer.appendChild(websiteIconLink);
        websiteIconLink.appendChild(websiteIconDef);
        websiteIconDef.appendChild(websiteIcon);
        websiteIconContainer.appendChild(websiteName);
    }
};
const extendWebsiteList = async () => {
    document.querySelector('.extendButton').classList.add('grey');
    const sites = await fetchSitesData(20 * fetchSitesCounter, 21);
    document.querySelector('.extendButton').classList.remove('grey');

    if (sites.Data) {
        if (!sites.Data[20]) {
            console.log('keine 21');
            document.querySelector('.extendButton').classList.add('hidden');
        } else {
            sites.Data.length = 20;
            console.log(sites);
        }
        createSiteList(sites.Data);
        fetchSitesCounter += 1;
    }
};
const sendFormInput = () => {
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
            text: `${nachname} ${vorname} ${email} \n${stadt} ${plz} ${straße} \n${link} \n${anmerkungen} lllll`
        }).then((data) => {
            if (data.status === 200) {
                chayns.dialog.alert('', 'Wir haben deine Anfrage erhalten').then(console.log);

                document.querySelector('.Vorname').value = null;
                document.querySelector('.Nachname').value = null;
                document.querySelector('.PLZ').value = null;
                document.querySelector('.Stadt').value = null;
                document.querySelector('.Straße').value = null;
                document.querySelector('.E-Mail').value = null;
                document.querySelector('.Link').value = null;
                document.querySelector('.Anmerkungen').value = null;
            }
        });
    }
};
const FormAddEventListeners = () => {
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
};
const formInitialFunction = () => {
    document.querySelector('.Vorname').value = chayns.env.user.firstName;
    document.querySelector('.Nachname').value = chayns.env.user.lastName;

    const inputs2 = document.querySelectorAll('.mandatory');
    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs2) {
        formTestForInput(input);
    }
};
const init = async () => {
    try {
        await chayns.ready;
        chayns.ui.accordion.init();
    } catch (err) {
        console.error('No chayns environment found', err);
    }
    document.querySelector('.extendButton').addEventListener('click', () => { extendWebsiteList(); });
    document.querySelector('.formButton').addEventListener('click', () => { sendFormInput(); });

    // Initial Form Input Test
    formInitialFunction();

    FormAddEventListeners();

    extendWebsiteList();

    formRealignPlaceholder();
};

init();
