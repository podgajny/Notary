/* ============================================================
   JavaScript Exercises (Beginner-friendly, with tiny test runner)
   How to use:
   1) Open js/index.html in your browser.
   2) Click "Run Tests" after each TODO.
   3) Use your browser DevTools console for extra logs.

   You’ll see explanations + tiny examples, then a TODO.
   Feel free to ask AI to “fill just the TODO” and then read the result.
   ============================================================ */

// ---------- Simple in-page "test runner" (no dependencies) ----------
const resultsEl = document.getElementById('results');
const runBtn = document.getElementById('runBtn');

function clearResults() {
  resultsEl.innerHTML = '';
}

function showResult(ok, label, detail = '') {
  const row = document.createElement('div');
  row.className = 'test-row';
  const icon = document.createElement('span');
  icon.textContent = ok ? '✅' : '❌';
  icon.className = ok ? 'pass' : 'fail';
  const text = document.createElement('span');
  text.innerHTML = `<strong>${label}</strong>${detail ? ` — ${detail}` : ''}`;
  row.appendChild(icon);
  row.appendChild(text);
  resultsEl.appendChild(row);
}

function approxEqual(a, b, eps = 1e-9) {
  return Math.abs(a - b) <= eps;
}

async function runTests() {
  clearResults();

  // Each test is an async function; failures should throw.
  const tests = [
    // 1) Variables & Types
    async () => {
      showGroup('Variables & Types');
      showResult(typeof PI === 'number', 'PI is a number');
      showResult(typeof radius === 'number', 'radius is a number');
      showResult(approxEqual(area1, PI * radius * radius), 'area1 computed correctly');
      showResult(
        greetingTemplate.includes(myName),
        'Template string contains your name',
        `value="${greetingTemplate}"`
      );
    },

    // 2) Equality & Truthy/Falsy
    async () => {
      showGroup('Equality & Coercion');
      showResult(isSameLoose === true, "'5' == 5 should be true");
      showResult(isSameStrict === false, "'5' === 5 should be false");
      showResult(Boolean(truthyValue) === true, "truthyValue is truthy");
      showResult(Boolean(falsyValue) === false, "falsyValue is falsy");
    },

    // 3) Functions
    async () => {
      showGroup('Functions');
      showResult(sum(2, 3) === 5, 'sum(2,3) === 5');
      showResult(sum(2) === 2, 'sum(2) === 2 (default param)');
      showResult(sum() === 0, 'sum() === 0 (both default)');
      showResult(typeof toTitleCase === 'function' && toTitleCase('hello world') === 'Hello World', 'toTitleCase works');
    },

    // 4) Arrays
    async () => {
      showGroup('Arrays (map/filter/reduce)');
      const sample = [
        { name: 'Ana', age: 17 },
        { name: 'Ben', age: 18 },
        { name: 'Cia', age: 27 }
      ];
      const adults = filterAdults(sample);
      showResult(Array.isArray(adults) && adults.join(',') === 'Ben,Cia', 'filterAdults returns names of 18+');

      const nums = [2, 4, 6, 8];
      showResult(arrayAverage(nums) === 5, 'arrayAverage([2,4,6,8]) === 5');

      const doubled = doubleAll([1, 2, 3]);
      showResult(doubled.join(',') === '2,4,6', 'doubleAll maps correctly');
    },

    // 5) Objects & Destructuring
    async () => {
      showGroup('Objects & Destructuring');
      const p = { name: 'Widget', price: 100, taxRate: 0.23 };
      showResult(calcGross(p) === 123, 'calcGross(product) returns price*(1+taxRate)');

      const user = { profile: { email: 'a@b.com' } };
      showResult(getEmail(user) === 'a@b.com', 'getEmail reads nested value (optional chaining)');
      showResult(getEmail({}) === null, 'getEmail returns null when missing');
    },

    // 6) Conditionals & Loops
    async () => {
      showGroup('Conditionals & Loops');
      const out = fizzBuzz(15);
      showResult(
        Array.isArray(out) && out.slice(0, 15).join(',') === '1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz',
        'fizzBuzz(15) standard sequence'
      );
    },

    // 7) DOM & Events
    async () => {
      showGroup('DOM & Events');
      // Simulate user typing + clicking
      const input = document.getElementById('nameInput');
      const out = document.getElementById('helloOut');
      const btn = document.getElementById('helloBtn');
      input.value = '  Krzysztof  ';
      btn.click();
      await wait(10);
      showResult(out.textContent === 'Hello, Krzysztof!', 'Clicking button shows greeting with trimmed name');
    },

    // 8) Async (Promises, async/await)
    async () => {
      showGroup('Async (Promises / async/await)');
      const u = await fakeFetchUser(42);
      showResult(u && u.id === 42 && typeof u.name === 'string', 'fakeFetchUser resolves with id and name');
      const upper = await getUserNameUpper(42);
      showResult(typeof upper === 'string' && upper === upper.toUpperCase(), 'getUserNameUpper returns UPPERCASE');
    },

    // 9) Error Handling
    async () => {
      showGroup('Error Handling');
      let threw = false;
      try { divide(10, 0); } catch (e) { threw = true; }
      showResult(threw, 'divide throws on division by zero');
      showResult(divide(9, 3) === 3, 'divide(9,3) === 3');
    },

    // 10) JSON Basics
    async () => {
      showGroup('JSON Basics');
      const sample = { id: 1, name: 'Notebook', price: 19.99 };
      const s = toJSON(sample);
      const back = fromJSON(s);
      showResult(typeof s === 'string' && s.includes('"name":"Notebook"'), 'toJSON returns a string');
      showResult(back && back.name === 'Notebook' && back.price === 19.99, 'fromJSON parses correctly');
    },
  ];

  try {
    for (const t of tests) {
      await t();
    }
  } catch (err) {
    console.error(err);
    showResult(false, 'Test runner error', String(err));
  }
}

function showGroup(title) {
  const sep = document.createElement('div');
  sep.className = 'test-row';
  sep.innerHTML = `<span>🧪</span><strong>${title}</strong>`;
  resultsEl.appendChild(sep);
}

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

runBtn.addEventListener('click', runTests);

// -------------------------------------------------------------------
// 1) VARIABLES & TYPES + TEMPLATE LITERALS
// Explanation:
// - `const` for values that don’t get reassigned; `let` when they do.
// - Numbers, strings, booleans are the core primitive types.
// - Template strings: `Hello, ${name}!`
// Example:
const exampleA = 2;
const exampleB = 3;
const exampleSum = `${exampleA} + ${exampleB} = ${exampleA + exampleB}`; // "2 + 3 = 5"
// console.log(exampleSum);

// TODO: Set PI to 3.14159 (number), radius to 5, and compute area1 = PI * radius^2.
// TODO: Create your name string in myName, and greetingTemplate = `Hi, ${myName}!`.
const PI = /* TODO */ 3.14159;           // keep as number
let radius = /* TODO */ 5;               // you can change later if you want
let area1  = /* TODO */ PI * radius * radius;

const myName = /* TODO */ 'Krzysztof';
const greetingTemplate = /* TODO */ `Hi, ${myName}!`;


// -------------------------------------------------------------------
// 2) EQUALITY & COERCION
// Explanation:
// - `==` does type coercion; `===` checks value AND type (safer).
// - Truthy: non-empty strings, non-zero numbers, objects, arrays.
// - Falsy: 0, "", null, undefined, NaN, false.
// Example:
const exLoose = ('5' == 5);   // true
const exStrict = ('5' === 5); // false

// TODO: set isSameLoose to result of '5' == 5 (should be true)
// TODO: set isSameStrict to result of '5' === 5 (should be false)
// TODO: set truthyValue to any truthy value, falsyValue to any falsy one
const isSameLoose  = /* TODO */ ('5' == 5);
const isSameStrict = /* TODO */ ('5' === 5);
const truthyValue  = /* TODO */ 'ok';
const falsyValue   = /* TODO */ '';


// -------------------------------------------------------------------
// 3) FUNCTIONS (DECLARATIONS, DEFAULTS, ARROW)
// Explanation:
// - Default params: function sum(a = 0, b = 0) { return a + b; }
// - Arrow fx: const f = x => x * 2;
// Example:
function double(x) { return x * 2; }
const triple = (x) => x * 3;

// TODO: Implement sum(a = 0, b = 0) returning a + b
// TODO: Implement toTitleCase(str): "hello world" -> "Hello World"
function sum(a = 0, b = 0) {
  /* TODO */
  return a + b;
}

function toTitleCase(str) {
  /* TODO */
  return String(str)
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}


// -------------------------------------------------------------------
// 4) ARRAYS: map / filter / reduce
// Explanation:
// - filter: keep some items
// - map: transform items
// - reduce: fold to a single value
// Example:
const numbers = [1, 2, 3];
const squared = numbers.map(n => n * n); // [1,4,9]

// TODO: filterAdults(people) → array of names for age >= 18
// TODO: arrayAverage(nums) → average (use reduce)
// TODO: doubleAll(nums) → new array with each value*2 (use map)
function filterAdults(people) {
  /* TODO */
  return people
    .filter(p => p.age >= 18)
    .map(p => p.name);
}

function arrayAverage(nums) {
  /* TODO */
  if (!nums.length) return 0;
  const total = nums.reduce((acc, n) => acc + n, 0);
  return total / nums.length;
}

function doubleAll(nums) {
  /* TODO */
  return nums.map(n => n * 2);
}


// -------------------------------------------------------------------
// 5) OBJECTS & DESTRUCTURING
// Explanation:
// - Access: obj.key or obj['key']
// - Destructuring: const { price, taxRate } = product;
// - Optional chaining: obj?.a?.b (won’t throw if missing)
// Example:
const gadget = { name: 'Lamp', price: 50 };
const { price: gadgetPrice } = gadget; // 50

// TODO: calcGross(product) → price*(1+taxRate)
// TODO: getEmail(user) → safely read user.profile.email or return null
function calcGross(product) {
  /* TODO */
  const { price, taxRate } = product;
  return +(price * (1 + taxRate)).toFixed(2);
}

function getEmail(user) {
  /* TODO */
  return user?.profile?.email ?? null;
}


// -------------------------------------------------------------------
// 6) CONDITIONALS & LOOPS
// Explanation:
// - if/else and switch control flow
// - for/of over arrays is handy
// Example:
function sign(x) { return x > 0 ? 'pos' : x < 0 ? 'neg' : 'zero'; }

// TODO: fizzBuzz(n) → array [1..n] with rules:
//  - multiple of 3 => "Fizz", 5 => "Buzz", both => "FizzBuzz"
function fizzBuzz(n) {
  /* TODO */
  const out = [];
  for (let i = 1; i <= n; i++) {
    const fizz = (i % 3 === 0);
    const buzz = (i % 5 === 0);
    out.push(fizz && buzz ? 'FizzBuzz' : fizz ? 'Fizz' : buzz ? 'Buzz' : String(i));
  }
  return out;
}


// -------------------------------------------------------------------
// 7) DOM & EVENTS
// Explanation:
// - query elements: document.querySelector('#id')
// - set text: el.textContent = '...'
// - listen to events: el.addEventListener('click', handler)
// Example: see below in the handler.

const nameInput = document.getElementById('nameInput');
const helloBtn  = document.getElementById('helloBtn');
const helloOut  = document.getElementById('helloOut');

// TODO: On click, read nameInput.value, trim it, and set helloOut text to "Hello, NAME!"
helloBtn.addEventListener('click', () => {
  /* TODO */
  const name = (nameInput.value || '').trim();
  if (name) {
    helloOut.textContent = `Hello, ${name}!`;
  } else {
    helloOut.textContent = '(please type a name)';
  }
});


// -------------------------------------------------------------------
// 8) ASYNC: PROMISES & async/await
// Explanation:
// - Promise resolves later; async/await makes it read like sync code.
// - Here we "fake" a server call with setTimeout.
// Example below.

// TODO: fakeFetchUser(id) → Promise resolves after 200ms with {id, name}
// TODO: getUserNameUpper(id) → await fakeFetchUser, return UPPERCASE name
function fakeFetchUser(id) {
  /* TODO */
  return new Promise(resolve => {
    setTimeout(() => {
      const user = { id, name: `user_${id}` };
      resolve(user);
    }, 200);
  });
}

async function getUserNameUpper(id) {
  /* TODO */
  const u = await fakeFetchUser(id);
  return u.name.toUpperCase();
}


// -------------------------------------------------------------------
// 9) ERROR HANDLING
// Explanation:
// - throw new Error('message') to signal problems
// - try { ... } catch (e) { ... } finally { ... }
// Example:
function parsePositiveInt(s) {
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0) throw new Error('Not a positive integer');
  return n;
}

// TODO: divide(a, b) → if b===0 throw Error('Division by zero'), else return a/b
function divide(a, b) {
  /* TODO */
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}


// -------------------------------------------------------------------
// 10) JSON BASICS
// Explanation:
// - JSON.stringify(obj) -> string
// - JSON.parse(string) -> object
// Example:
const demo = { ok: true };
const demoStr = JSON.stringify(demo); // '{"ok":true}'

// TODO: toJSON(obj) returns string; fromJSON(str) returns object
function toJSON(obj) {
  /* TODO */
  return JSON.stringify(obj);
}

function fromJSON(str) {
  /* TODO */
  return JSON.parse(str);
}


// -------------------------------------------------------------
// Extra: helpful console tips for your session (visible in DevTools)
console.log('%cTip:', 'font-weight:bold', 'Use console.log(var) to see values; right-click → Inspect → Console.');
console.log('Try adding %cdebugger;', 'font-weight:bold', 'in a function, then click "Run Tests" to pause execution.');
