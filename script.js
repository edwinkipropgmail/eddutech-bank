//'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Edwin Kiprop',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Cheruiyot Kiplangat',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Oscar kemboi',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Benard Kipngetich',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const messageStyling = function() {
  message.style.opacity = '100';
  message.style.fontSize = '1.2rem';
  message.style.color = '#00ff00';
};
const errorMessageStyling  = function() {
  message.style.opacity = '100';
  message.style.color = 'red';
  message.style.fontSize = '1.5rem';
};


const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort? movements.slice().sort((a, b)=> a-b) : movements;

  movs.forEach(function (mov, i) {
   

    const type = mov > 0 ? 'deposit' : 'withdrawal';
const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1}.  ${type}</div>
          <div class="movements__value"> ksh. ${Math.abs(mov)}.00</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};


const calcDisplayBalance = function(acc) {
  acc.balance= acc.movements.reduce((acc, mov)=>acc+mov, 0);
 

  labelBalance.textContent= `. ${acc.balance}`
};


const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov=>mov>0).reduce((acc, mov)=>acc+mov, 0);
  labelSumIn.textContent= `ksh. ${incomes}`;

  const out = movements.filter(mov=>mov<0).reduce((acc, mov)=>acc+mov, 0);
  labelSumOut.textContent= `ksh. ${Math.abs(out)}`;

  const interest = movements.filter(mov=>mov>0).map(deposit=>(deposit*acc.interestRate)/100).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `ksh. ${interest}`
};



const createUsernames = function(accs) {
  accs.forEach(function(acc) {
  
   acc.username = acc.owner.toLowerCase().split(' ').map((name)=>name[0]
  )
  .join('');
  })
  
} 
 createUsernames(accounts);

 const updateUI = function(acc) {
  
  //displaying movements
  displayMovements(acc.movements);
//Displaying balance
  calcDisplayBalance(acc);
//Displaying summary
  calcDisplaySummary(acc);
 }

 let currentAccount; 
 btnLogin.addEventListener('click', function(e) {
e.preventDefault();
currentAccount= accounts.find(acc=> acc.username===inputLoginUsername.value);


if(currentAccount?.pin === Number(inputLoginPin.value)) {
  // Display UI 
  labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]} -:)`;

  containerApp.style.opacity = 100;
  message.style.opacity = '0';

  //clearing input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  updateUI(currentAccount);
}
else {
  
  labelWelcome.textContent ='You Entered a wrong PIN/Username';
  inputLoginUsername.value = inputLoginPin.value = '';
}

 });

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
  
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
   
   messageStyling();
    message.textContent = `CONFIRMED. You have transfered Ksh. ${amount} to ${receiverAcc.owner} on ${date}.`;

  }
  else {
    errorMessageStyling();
  message.textContent = 'Invalid Transaction. Please Try again..!!';
  
  updateUI(currentAccount);
  
};
  
});

const date = new Date();
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov=> mov >= amount*0.1)) {
    message.textContent = `CONGRATULATIONS! 🎊🎊. You are awarded a loan of Ksh. ${amount} on ${date}.`;
    
    messageStyling();

    currentAccount.movements.push(amount);

    updateUI(currentAccount);
   
  }
  else if (amount<= 0) {
    errorMessageStyling();
    message.textContent = `You Cannot borrow a loan of Ksh.${amount} because it is too LOW!`
  }
   else {
   errorMessageStyling();
  message.textContent = `The loan Amount of Ksh. ${amount} You requested is too HIGH. please try a Lower Amount..!`
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {

    const index = accounts.findIndex(acc=>acc.username === currentAccount.username);
  
accounts.splice(index, 1);
containerApp.style.opacity = 0;
  }
});
let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const message = document.querySelector('.error');

 const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*let arr = ['a', 'b', 'c', 'd', 'e'];

//slice method
console.log(arr.slice(2));
console.log(arr.slice(2, 5));
console.log(arr.slice(3, -3));
console.log(arr.slice());
console.log([...arr]);

//splice method
console.log(arr.splice(2));
arr.splice(1,2);
console.log(arr);

//Reverse method
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['d', 'g', 't', 'l', 'y','o'];
console.log(arr2.reverse());
console.log(arr2);

//concat method
const letters = arr.concat(arr2);
console.log(letters);

//join Method
console.log(letters.join('_____'));
*/

/*const arr = [ 23, 11, 64];
console.log(arr[0]);
console.log(arr.at(1));

console.log(arr[arr.length-1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-2));
*/

/*
const date = new Date();
let movement;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (movement of movements) {
  if (movement>0) {
    console.log(`You deposited KSH. ${movement}/= on ${date}`);
  }
  else {
    console.log(`You withdrew KSH. ${Math.abs(movement)}/= on ${date}`);
  }
};

console.log('____ROREACH_____');

movements.forEach (function(mov, i, arr) {
  if (mov>0) {
    console.log(`TRANSACTION ${i +1}: You deposited KSH. ${mov}/= on ${date}` );
  }
  else {
    console.log(`TRANSACTION ${i +1}: You withdrew KSH. ${Math.abs(mov)}/= on ${date}`);
  }
});
*/

/*
//Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
});

//set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, map) {
  console.log(`${value}: ${value}`);
})
  */

/*
const checkDogs = function(dogsJulia, dogsKate) {
const dogjuliacorrected = dogsJulia.slice();
dogjuliacorrected.splice(0,1);
dogjuliacorrected.splice(-2);
console.log(dogjuliacorrected);

const dogs = dogjuliacorrected.concat(dogsKate);
console.log(dogs);

dogs.forEach(function(dog, i) {
  if (dog >= 3) {
    console.log(`The dog number ${i+1} is an adult because it is ${dog} years old`);
  }
  else {
    console.log(`The dog number ${i+1} is a PUPPY because it is ${dog} years old`);
  }
})
};
checkDogs([3, 5, 2, 456,  12, 7], [4, 1, 15, 8, 3]);
*/

/*\
const usdtoKsh = 136.;
const movementUsd = account1.movements.map(function (mov) {
  return mov*usdtoKsh;
});
console.log(account1.movements);
console.log(movementUsd);

const movementdescription = account1.movements.map((mov, m) =>  `movement ${m+1}: You ${mov >0 ? 'deposited' : 'Withdew'} Ksh. ${Math.abs(mov)} `);

console.log(movementdescription);

let myScore = [23, 45, -56, 0, -12, 4, -1];
const describeMyscore = myScore.map((score, r)=> `Trial No ${r+1}: You scored ${score} and therefore you ${score>0 ? 'Won the game': 'Failed the game'}`);

console.log(describeMyscore);



let theRates = [100, 80, 56, 141, 500, 78, 610, 101, 0];

const describeTherates = theRates.map((rating, marks)=>`Person ${marks+1} has just rated your app to ${rating}. That means he ${rating>=100? 'LIKED' : 'HATED'} your app`);

console.log(describeTherates);

*/

/*
const deposits = account1.movements.filter ((mov) =>mov > 0);
console.log(account1.movements);
console.log(deposits);

const withdrawal = account1.movements.filter(mov=>mov<0);
// const withdrawals = Math.abs(withdrawal);

console.log(withdrawal);
*/


/*
const movements = account1.movements;
console.log(movements);

const balance = movements.reduce(function(acc, curr, i ,arr){
  console.log(`iteration ${i}: ${acc}`);
 return acc+curr
 }, 0);

console.log(balance);
*/

/*
//maximum Value 
const max = movements.reduce((acc, mov)=>{
  if (acc>mov)
   return acc;

  else 
return mov;
}, movements[0]);
console.log(max);
*/


/*
const calcAvarageHumanAge = [5, 2, 4, 1, 15, 8, 3];
const ages = calcAvarageHumanAge.map((age)=>{
 
  if (age<=2)
    return age*2;
  else
  return (16 + age * 4);

});
console.log(ages);
const adultDogs = ages.filter((dogs)=>{
  if (dogs>18)
    return dogs
});
console.log(adultDogs);

const avarageAges = adultDogs.reduce((acc, current)=>acc+current,0)/adultDogs.length;
console.log(avarageAges);
*/

/*
usdToKsh = 136;

//PIPELINE
const totalDepositsInKsh = movements.filter(mov=>mov>0).map(mov => mov*usdToKsh).reduce((acc, mov)=>acc+mov, 0);
 
console.log(totalDepositsInKsh);
*/
const removeveErrorAndTransactionMessages = document.querySelector('.error');

removeveErrorAndTransactionMessages.addEventListener('click', function() {
  message.style.opacity = '0';
  updateUI(currentAccount);
});



/*
const owners = ['Elly', 'Esther','Edwin', 'Zack'];
console.log(owners.sort());

movements.sort((a, b)=>a-b);
console.log(movements);
*/

// const randomDiceRoll = Array.from ({length: 100}, () => Math.trunc(Math.random()*6 + 1));
// console.log(randomDiceRoll);

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
const aliceAndBobDogs = {
  weight: 22,
  curFood: 250
};
const MatildaDogs = {
  weight: 8, 
  curFood: 200
};
const sarahAndJohnDogs = {
  weight: 13, 
  curFood: 275
};
const michaelDogs = {
  weight: 32, 
  curFood: 340
};
const recomendedFood  = aliceAndBobDogs.weight**0.75 * 28;
const adding = recomendedFood.push;
console.log(recomendedFood);