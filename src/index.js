/* eslint-disable no-param-reassign */
import './app.scss';


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
}
const init = async () => {
    try {
        formRealignPlaceholder();
        await chayns.ready;
        chayns.ui.accordion.init();
    } catch (err) {
        console.error('No chayns environment found', err);
    }
};

init();
