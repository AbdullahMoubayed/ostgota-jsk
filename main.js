import './css/style.css';

let listIcon = document.querySelector('.list-icon');
let dropdownIcon = document.querySelectorAll('.dropdown-icon');

//toggle nav menu
listIcon.addEventListener('click', () => {
  listIcon.classList.toggle('active');
  document.querySelector('.nav-body').classList.toggle('open');
});

//toggle sropdown menu
dropdownIcon.forEach(icon => {
  icon.addEventListener('click', () => {
    icon.classList.toggle('active');
    icon.nextElementSibling.classList.toggle('open');
  });
});