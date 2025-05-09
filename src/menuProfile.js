document.addEventListener('DOMContentLoaded', () => {
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

    fetch('/getUserData').then(response => response.json()).then(data => {
        console.log(data.profileimage)
        data.nome&&(document.querySelector('.menuProfile text').innerHTML=data.nome)
        data.nome && (document.querySelector('.profileUser-name text').innerHTML = data.nome)
        data.profileimage && (document.querySelector('.profileUser-img img').attributes.src.value = data.profileimage)
    })
})