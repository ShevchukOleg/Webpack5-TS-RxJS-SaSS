import someImage from "../assets/resource/images/DesktopWallpaper.jpg"
import { component_1 } from "@components/component_one";
import '../css/style.css';
import '../scss/style.scss';
import json from "../js/JSON/test.json";

console.log("JSON file content:", json);
document.body.appendChild(component_1());
const img = document.createElement("img");
img.src = someImage;
console.log(img);
document.body.appendChild(img);

// new JS featuters
async function start() {
  return await Promise.resolve("Async is working");
}

start().then(console.log);

class Util {
  static id = Date.now();
}

console.log("Id:", Util.id);

// ___________________________ RxJS lerning

const input_1 = document.querySelector('input[name="Main text"]');
const input_2 = document.querySelector('input[name="Second text"]');
console.log(input_1);

const promiseOnEL = new Promise((resolve) => {
  input_1.addEventListener('input', (e) => {
    resolve(e);
  });
})

promiseOnEL.then((event: KeyboardEvent) => {
  console.log('Simple promise works:', (event.target as HTMLInputElement).value);
});
//____________________________________________ Recursive promise function
(function eventPromise() {
  let listener: (event: KeyboardEvent) => void;

  const p = new Promise((resolve) => {
    listener = (e) => {
      resolve(e);
    }
    input_1.addEventListener('input', listener);
  });

  p.then((event: KeyboardEvent) => {
    const value = (event.target as HTMLInputElement).value
    console.log('Recursive function promise works:', value);
    fetch(`https://api.github.com/search/repositories?q=${value}`)
      .then(response => response.json())
      .then(parsedInfo => { console.log(parsedInfo) });
    input_1.removeEventListener('input', listener);
    eventPromise();
  })
})();

import { fromEvent, of, from, timer, interval, range, empty, throwError } from 'rxjs';
import { switchMap, debounceTime, filter, ignoreElements } from 'rxjs/operators'
const observable = fromEvent(input_2, 'input');
observable.pipe(
  debounceTime(600),
  switchMap(
    (event: KeyboardEvent) => {
      const value = (event.target as HTMLInputElement).value;
      return fetch(`https://api.github.com/search/repositories?q=${value}`).then(response => response.json());
    }
  )
).subscribe(response => {
  console.log(response.total_count);
})


// --------------------Chapter 2
import { Observable, Observer, } from 'rxjs';

//Створення нового observable
const observable_1 = new Observable(
  function subscriber(observer: Observer<string | number>) {
    try {
      let counter = 0;
      observer.next('Some text');
      observer.next('Another text');
      console.log(Date.now());
      observer.next('Final text');
      setInterval(_ => {
        (counter === 3) ? unsubscribe_2() : null;
        observer.next(counter++);
      }, 300);
      setTimeout(_ => {
        observer.complete();
      }, 1800);
    } catch (err) {
      observer.error(err);
    }
  }
)


const subscription_1 = observable_1.subscribe(
  (nextData) => console.log("observable_1:", nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_1 !")
);

const subscription_2 = observable_1.subscribe(
  (nextData) => console.log("observable_2:", nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_2 !")
)

function unsubscribe_2() {
  subscription_2.unsubscribe();
  console.warn('subscription_2 unsubscribed!')
}

setTimeout(() => {
  subscription_1.unsubscribe();
  console.warn('subscription_1 unsubscribed!')
}, 5000)


//________________Методи створення Observable

const observable_2 = of(1, 3, 15, 67, 33, 92);
observable_2.subscribe(
  (nextData) => console.log(nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_2 !")
);

const observable_3 = from([1, 3, 15, 67, 33, 92]);

observable_3.subscribe(
  (nextData) => console.log(nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_3 !")
);

const observable_from_Promise = from(Promise.resolve(777));
observable_from_Promise.subscribe(
  (nextData) => console.log(nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_from_Promise !")
);

// const observable_timer = timer(0, 400)
// const observable_interval = interval(500);
// observable_timer.subscribe(
//   (nextData) => console.log(nextData),
//   (errorData) => console.warn(errorData),
//   () => console.log("Completed observable_2 !")
// );

const observable_range = range(0, 11);
observable_range.subscribe(
  (nextData) => console.log("Range observer:", nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_range !")
);

const observable_empty = empty();
observable_empty.subscribe(
  (nextData) => console.log("Range observer:", nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed observable_empty !")
);

const observable_Error = throwError('Generated error');
observable_Error.subscribe(
  (nextData) => console.log("Range observer:", nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed observable_empty !")
);

//____________________Pipe and Intermediate data processing
// first, last, single
const rengeProcessing = observable_range.pipe(
  filter((value) => {
    return value > 5;
  })
).subscribe(
  (value) => console.log('rengeProcessing', value)
)

// фільтрація всіх значень з видачою лише статусу роботи Observable
const rengeProcessing_2 = observable_range.pipe(
  ignoreElements()
).subscribe(
  (nextData) => console.log("rengeProcessing_2:", nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed rengeProcessing_2 !")
)