import './css/style.css';

let listIcon = document.querySelector('.list-icon');

//toggle nav menu
listIcon.addEventListener('click', () => {
  listIcon.classList.toggle('active');
  document.querySelector('.nav-body').classList.toggle('open');
});