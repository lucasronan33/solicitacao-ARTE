const imgProfileUser = document.querySelector('.profileUser-img');
const menuProfile = document.querySelector('.menuProfile');
const menuProfileText = document.querySelector('#menuProfile-text');

const logout = document.querySelector('.logout');
const settings = document.querySelector('.settings');
document.addEventListener('click', (e) => {
    if (imgProfileUser.contains(e.target) &&
        menuProfile.style.display == 'none') {
        menuProfile.style.display = 'flex';
    } else {
        menuProfile.style.display = 'none';
    }
})

logout.addEventListener('click', () => {
    window.location.href = '/logout';
});

settings.addEventListener('click', () => {
    window.location.href = '/accountSettings';
});