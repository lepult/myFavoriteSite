export default (func) => {
    chayns.addAccessTokenChangeListener(func);
    chayns.login();
};
