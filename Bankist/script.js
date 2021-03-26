'use strict';

const account1 = {
  owner: 'Jiten Kumar',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-03-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (movement, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(movement);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date, account.locale);
    const formattedMov = formatCurrency(
      movement,
      account.locale,
      account.currency
    );
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = formatCurrency(
    balance,
    account.locale,
    account.currency
  );
  account.balance = balance;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const out = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(intrst => intrst >= 1)
    .reduce((acc, intrst) => acc + intrst, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  let time = 60;
  const tick = function () {
    const mins = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = time % 60;
    labelTimer.textContent = `${mins}:${secs}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  inputCloseUsername.value = inputClosePin = '';

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
