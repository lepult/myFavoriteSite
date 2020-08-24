/* eslint-disable no-param-reassign */
import './app.scss';
import 'whatwg-fetch';


// eslint-disable-next-line no-unused-vars
/*
function handleFormPlaceholderPosition() {
    for (let i = 0; i < document.getElementsByClassName('formInput').length; i += 1) {
        // if (document.getElementById(`${i}`).value) {
            document.getElementsByClassName('formInput')[i].classList.add('labelRight');
        // }
    }
}
*/

 const formRealignPlaceholder = () => {
     console.log('test');
    for (let i = 0; i < document.getElementsByClassName('formInput').length; i += 1) {
        // if (document.getElementById(`${i}`).value) {
            document.getElementsByClassName('formInput')[i].classList.add('labelRight');
    }
    console.log('sad');
};
const fetchSitesData = async () => {
    try {
        const response = await fetch('https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=pizza&Skip=0&Take=20');
        const json = await response.json();
        console.log('parsed json', json);
        return json;
    } catch (ex) {
        console.log('parsing failed', ex);
    }
};

const createSiteList = (sites) => {
    console.log(sites);
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
        websiteIcon.src = `https://sub60.tobit.com/l/${site.locationId}?size=20`;

        document.querySelector('.websiteList').appendChild(websiteIconContainer);
        websiteIconContainer.appendChild(websiteIconLink);
        websiteIconLink.appendChild(websiteIcon);
        websiteIconContainer.appendChild(websiteName);
    }
};

const init = async () => {
    try {
        await chayns.ready;
        chayns.ui.accordion.init();
    } catch (err) {
        console.error('No chayns environment found', err);
    }
    const sites = await fetchSitesData();
    console.log(sites);
    createSiteList(sites.Data);

    formRealignPlaceholder();
};

init();
