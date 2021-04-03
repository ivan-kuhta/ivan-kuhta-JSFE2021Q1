const header = document.querySelector('header');
header.querySelector('.menu__icon').addEventListener('click', () => {
    header.querySelector('.menu__icon').classList.toggle('active');
    header.querySelector('.menu__body').classList.toggle('active');
})