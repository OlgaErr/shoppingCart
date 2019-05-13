function setFocus(elem) {
  elem.focus();
}

function hideElem(elem) {
  elem.style.display = 'none'; 
}

function showElem(elem) {
  elem.style.display = 'block'; 
}

function openForm() {
  const form = document.getElementById('form');
  form.style.display = 'block';
  const focusOn = document.getElementById('formGroupTitle');
  const btnPlus = document.getElementsByClassName('myBtn')[0];

  hideElem(btnPlus);
  setFocus(focusOn);
}

function closeForm() {
  const form = document.getElementById('form');
  form.style.display = 'none';
  const btnPlus = document.getElementsByClassName('myBtn')[0];

  showElem(btnPlus);
}

function create() {
  const spinner = document.getElementById('form__spinner');
  spinner.style.display = 'block';
}