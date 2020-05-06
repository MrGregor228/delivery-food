const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// day 1

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeModalAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
  buttonModalLogin = document.querySelector('.button-login');

let login = localStorage.getItem('deliveryFood');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  console.log('Авторизован');

  function logOut() {
    login = null;    

    localStorage.removeItem('deliveryFood');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}
function notAuthorized() {
  console.log('Не авторизован');
  function logIn(event) {
    event.preventDefault();
    console.log('Логин');
    login = loginInput.value;
    toggleModalAuth();

    localStorage.setItem('deliveryFood', login);

    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeModalAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    checkAuth();
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeModalAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
checkAuth();

function loginModalButtonLocked() {
  buttonModalLogin.setAttribute('disabled', 'disabled');
  buttonModalLogin.style.pointerEvents = 'none';
  buttonModalLogin.style.filter = 'grayscale(100%)';
}
loginModalButtonLocked();

loginInput.addEventListener('input', function () {
  loginModalButtonLocked();
  setInterval(function () {
    if (loginInput.value == '' || loginInput.value == ' ' || loginInput.value.length <= 3) {      
      loginInput.style.cssText = 'border-color:red; box-shadow:0 0 0 1px red, inset 0 0 0 1px red; color:red;';
      loginInput.placeholder = 'Введите логин!';      
    } else {
      loginInput.style.cssText = 'border-color:inherit; box-shadow:none; color:inherit;filter:grayscale(0%);';
      buttonModalLogin.removeAttribute('disabled', 'disabled');
      buttonModalLogin.style.cssText = 'filter:grayscale(0%);pointer-events:default;';
      clearInterval();
    }
  }, 100);
});

