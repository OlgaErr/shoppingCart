// const express = require('express');
// const app = express();

fetch('/api/users/1/lists')
  .then(response => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      const card = createCardOnBoard(data[i]);
    }
  })
  .catch(error => console.error(error));


function setFocus(elem) {
  elem.focus();
}

function hideElem(elem) {
  elem.style.display = 'none';
}

function showElem(elem) {
  elem.style.display = 'block';
}

function createCardOnBoard({ name }) {
  console.log(name);
  const template = document.querySelector('#card');
  const clone = template.content.cloneNode(true);
  const h5 = clone.querySelectorAll('h5');
  h5[0].innerHTML = name;
  template.parentNode.appendChild(clone);
}

function formOfSubmit() {
  const submitForm = document.getElementById('submit-form');
  const btnPlus = document.getElementsByClassName('myBtn')[0];
  const focusOn = document.getElementById('exampleInputEmail1');

  hideElem(btnPlus);
  showElem(submitForm);
  setFocus(focusOn);
}

function regNewUser() {
  const user = document.getElementById('exampleInputLogin').value;

  const password = document.getElementById('exampleInputPassword').value;
  const name = document.getElementById('exampleInputName').value;
  const email = document.getElementById('exampleInputEmail').value;


  const b = JSON.stringify({
    user, password, name, group: '', email,
  });
  fetch('/api/users', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: b,
  }).then(response => response.json())
    .then(data => console.log(data));
}

function deleteList() {
  const { target } = event;
  const card = target.parentNode.parentNode.parentNode.parentNode;
  const board = document.getElementById('lists');

  board.removeChild(card);
}

function createList() {
  debugger;

  const name = document.getElementById('formGroupTitle').value;
  const message = document.getElementById('formGroupComment').value;

  const data = JSON.stringify({ name, message });
  fetch('/api/users/1/lists', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: data,
  }).then(response => response.json())
    .then((data) => {
      console.log(data);
      createCardOnBoard(data);
    });
}

function openList() {
  const hide = document.getElementById('lists-board');
  const show = document.getElementById('openCard')
  hideElem(hide);
  showElem(show);
}