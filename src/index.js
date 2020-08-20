import login from './utils/login';
import './app.scss';

const handleUserIsLoggedIn = ($introElement, $loginBtn) => {
    $introElement.innerText = `Hallo ${chayns.env.user.firstName}`;
    $loginBtn.innerText = 'Abmelden';
    $loginBtn.addEventListener('click', async () => {
        await chayns.logout();
        window.location.reload();
    });
};

const handleUserIsLoggedOut = ($introElement, $loginBtn) => {
    $introElement.innerText = 'Bitte melde dich an';
    $loginBtn.innerText = 'Anmelden';
    $loginBtn.addEventListener('click', () => {
        login(() => handleUserIsLoggedIn($introElement, $loginBtn));
    });
};

const init = async () => {
    try {
        await chayns.ready;

        const $introElement = document.querySelector('#intro');
        const $loginBtn = document.querySelector('#loginBtn');

        if (chayns.env.user.isAuthenticated) {
            handleUserIsLoggedIn($introElement, $loginBtn);
        } else {
            handleUserIsLoggedOut($introElement, $loginBtn);
        }
    } catch (err) {
        console.error('No chayns environment found', err);
    }
};

init();
