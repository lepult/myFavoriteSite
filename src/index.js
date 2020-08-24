/* eslint-disable no-param-reassign */
import './app.scss';
import 'whatwg-fetch';

let fetchSitesCounter = 1;
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
        const websiteIcon = document.createElement('img');
        const websiteName = document.createElement('div');

        websiteIconContainer.classList.add('websiteIconContainer');
        websiteIconLink.classList.add('websiteIconLink');
        websiteIcon.classList.add('websiteIcon');
        websiteName.classList.add('websiteName');

        websiteName.innerHTML = site.appstoreName;
        websiteIconLink.addEventListener('click', () => { chayns.openUrlInBrowser(`https://chayns.net/${site.siteId}`); });
        websiteIcon.src = `https://sub60.tobit.com/l/${site.locationId}?size=65`;


        document.querySelector('.websiteList').appendChild(websiteIconContainer);
        websiteIconContainer.appendChild(websiteIconLink);
        websiteIconLink.appendChild(websiteIcon);
        websiteIconContainer.appendChild(websiteName);
    }
};
const extendWebsiteList = async () => {
    const sites = await fetchSitesData(20 * fetchSitesCounter, 20);
    if (sites) {
        createSiteList(sites.Data);
        fetchSitesCounter += 1;
    }
};

const init = async () => {
    try {
        await chayns.ready;
        chayns.ui.accordion.init();
    } catch (err) {
        console.error('No chayns environment found', err);
    }
    const sites = await fetchSitesData(0, 20);
    document.querySelector('.extendButton').addEventListener('click', () => { extendWebsiteList(); });
    createSiteList(sites.Data);

    formRealignPlaceholder();
};

init();
