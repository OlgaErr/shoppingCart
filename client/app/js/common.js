function setFocus(elem) {
  elem.focus();
}

function openForm() {
  const form = document.getElementById('form');
  form.style.display = 'block';
  const focusOn = document.getElementById('formGroupTitle');
  
  setFocus(focusOn);
}

function closeForm() {
  const form = document.getElementById('form');
  form.style.display = 'none';
}

function create() {
  const spinner = document.getElementById('form__spinner');
  spinner.style.display = 'block';
}

