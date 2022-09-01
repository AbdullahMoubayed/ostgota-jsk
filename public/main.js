let listIcon = document.querySelector('.list-icon');
let dropdownIcon = document.querySelectorAll('.dropdown-icon');
let dropdownSpan = document.querySelectorAll('.dropdown-span');

//toggle nav menu
listIcon.addEventListener('click', () => {
  listIcon.classList.toggle('active');
  document.querySelector('.nav-body').classList.toggle('open');
});

//toggle sropdown menu
dropdownIcon.forEach((icon) => {
  icon.addEventListener('click', () => {
    icon.classList.toggle('active');
    icon.nextElementSibling.classList.toggle('open');
  });
});

//toggle sropdown menu (stadgar och lagar)
dropdownSpan.forEach((span) => {
  span.addEventListener('click', () => {
    span.classList.toggle('active');
    span.nextElementSibling.classList.toggle('open');
  });
});

// change header backgroud on scroll
window.addEventListener('scroll', () => {
  let header = document.querySelector('header');
  let headerHeight = header.offsetHeight;
  let scrollTop = window.pageYOffset;
  if (scrollTop > headerHeight) {
    header.classList.add('header-scroll');
  } else {
    header.classList.remove('header-scroll');
  }
});

const inputs = document.querySelectorAll('input');

const patterns = {
  name: /^[a-z]+$/i,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,8})?$/,
  pass: /^[\w@-]{8,20}$/i,
};

function validate(field, regex, e) {
  if (regex.test(field.value)) {
    field.className = 'valid';
    document.querySelector(
      `#${field.attributes.name.value}-err`
    ).style.display = 'none';
  } else {
    field.className = 'invalid';
    document.querySelector(
      `#${field.attributes.name.value}-err`
    ).style.display = 'inline-block';
  }
}

inputs.forEach((input) => {
  input.addEventListener('keyup', (e) => {
    let field = e.target.attributes.name.value;
    if (e.target.attributes.type !== 'submit') {
      validate(e.target, patterns[field], e);
    }
  });
});

function openPanel(panelName) {
  const panels = document.querySelectorAll('.panel-nav');
  let panelBtns = document.querySelectorAll('.panel-btn');

  panels.forEach((panel) => {
    panel.style.display = 'none';
  });

  panelBtns.forEach((panelBtn) => {
    panelBtn.classList.remove('active');
  });

  document.querySelector(`#${panelName}`).style.display = 'flex';
  document.querySelector(`.${panelName}`).classList.add('active');
}
