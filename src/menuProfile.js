const imgProfileUser = document.querySelector('.profileUser-img');
const menuProfile = document.querySelector('.menuProfile');
const menuProfileText = document.querySelector('#menuProfile-text');

const logout = document.querySelector('.logout');
const settings = document.querySelector('.settings');
document.addEventListener('click', (e) => {
    if (!menuProfile.contains(e.target) && !imgProfileUser.contains(e.target) && menuProfile.style.display == 'flex') {
        menuProfile.style.display = 'none';
    } else {
        menuProfile.style.display = 'flex';
    }
})

logout.addEventListener('click', () => {
    window.location.href = '/logout';
});

settings.addEventListener('click', () => {
    window.location.href = '/accountSettings';
});
