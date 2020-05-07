'use strict';

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeModalAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      buttonModalLogin = document.querySelector('.button-login'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      containerPromo = document.querySelector('.container-promo'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu'),
      cartButton = document.querySelector("#cart-button"),
      modal = document.querySelector(".modal"),
      close = document.querySelector(".close");

let login = localStorage.getItem('deliveryFood');

const getData = async function (url) {
  const response = await fetch(url);
  

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }
  
  return await response.json();
};


function toggleModal() {
  modal.classList.toggle("is-open");
}

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

function createCardRestaurant({ image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery } ) {  

  const card = `
  <a class="card card-restaurant" data-products="${products}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>  
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>  
    </div>
  </a>`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGoods({description, id, image, name, price}) {
  
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
    `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(e) {
  let alertDivOnPage = document.querySelector('.alert');
  const target = e.target,
    restaurant = target.closest('.card-restaurant');
  console.log(restaurant);

  if (restaurant && login) {
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    containerPromo.classList.add('hide');

    alertDivOnPage.classList.add('hide');

    getData(`../db/${restaurant.dataset.products}`).then(function(data) {
      data.forEach(createCardGoods);
    });

  } else {
    toggleModalAuth();
    alertDivOnPage.classList.remove('hide');
    alertDivOnPage.classList.add('fade');
    setTimeout(function () {
      alertDivOnPage.classList.add('hide');
    }, 2000);

    console.log(alertDivOnPage);
  }

  cardsMenu.textContent = '';
}




function init() {
  getData('../db/partners.json').then(function (data) {
    console.log(data);
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
    containerPromo.classList.remove('hide');
  });

  checkAuth();
}
init();