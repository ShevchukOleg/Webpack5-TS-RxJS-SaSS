import someImage from "../assets/resource/images/DesktopWallpaper.jpg"
import { component_1 } from "@components/component_one";
import '../css/style.css';
import '../scss/style.scss';

document.body.appendChild(component_1());
const img = document.createElement("img");
img.src = someImage;
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
import { switchMap, debounceTime, filter, ignoreElements, first, last, single, find, debounce } from 'rxjs/operators'
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

const observable_timer = timer(0, 400)
const observable_interval = interval(100);
// observable_interval.subscribe(
//   (nextData) => console.log(nextData),
//   (errorData) => console.warn(errorData),
//   () => console.log("Completed observable_interval!")
// );

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
  (value) => console.log('Filtering renge', value)
)

const rengeProcessing_first = observable_range.pipe(
  first((value: number) => {
    return (value > 6);
  }, 0)
).subscribe(
  (value) => console.log('Filter first renge:', value)
)

const clicks: Observable<Event> = fromEvent(document, 'click');
const result = clicks.pipe(first(
  (ev: Event) => {
    const element = ev.target as HTMLElement;
    return element.tagName === 'INPUT';
  }
));
result.subscribe(x => console.log("Input first click: ", x));

const rengeProcessing_last = observable_range.pipe(
  last((value: number) => {
    return (value < 5);
  }, 0)
).subscribe(
  (value) => console.log('Filter last renge:', value)
)

const rengeProcessing_single = observable_range.pipe(
  single((value: number, index, SourseObservable) => {
    return (value < 5);
  })
).subscribe(
  (value) => console.log('Filter last renge:', value),
  (error) => console.warn(error)
)


const rengeProcessing_single_2 = observable_range.pipe(
  single((value: number, index, SourseObservable) => {
    return (value === 5);
  })
).subscribe(
  (value) => console.log('Filter single_2 renge:', value),
  (error) => console.warn(error)
)

const fromProcessing_single_3 = from([1, 3, 5, 67, 5, 92]).pipe(
  single((value: number, index, SourseObservable) => {
    return (value === 5);
  })
).subscribe(
  (value) => console.log('Filter single_3 renge:', value),
  (error) => console.warn('Filter single_3 renge:', error)
)

const rengeProcessing_single_4 = observable_range.pipe(
  single((value: number, index, SourseObservable) => {
    return (value === 100);
  })
).subscribe(
  (value) => console.log('Filter single_4 renge:', value),
  (error) => console.warn('Filter single_4 renge:', error)
)

const rengeProcessing_find = observable_range.pipe(
  find((value: number) => {
    return (value === 6);
  })
).subscribe(
  (value) => console.log('Filter find renge:', value),
  (error) => console.warn('Filter find renge:', error)
)

const fromProcessing_find_2 = from([1, 3, 5, 67, 5, 92]).pipe(
  find((value: number) => {
    return (value === 11);
  })
).subscribe(
  (value) => console.log('Filter find_2 renge:', value),
  (error) => console.warn('Filter find_2 renge:', error)
)


// фільтрація всіх значень з видачою лише статусу роботи Observable
const rengeProcessing_2 = observable_range.pipe(
  ignoreElements()
).subscribe(
  (nextData) => console.log("rengeProcessing_2:", nextData),
  (errorData) => console.warn(errorData),
  () => console.log("Completed rengeProcessing_2 !")
)

const rengeProcessingDebounce_interval = observable_range.pipe(
  debounce(() => interval(500))
).subscribe(
  (nextData) => console.log("rengeProcessingDebounce:", nextData),
  (errorData) => console.warn("rengeProcessingDebounce", errorData),
  () => console.log("Completed rengeProcessingDebounce!")
)

const rengeProcessingDebounce_timer = interval(1000).pipe(
  debounce(() => timer(999))
).subscribe(
  (nextData) => console.log("rengeProcessingDebounce timer:", nextData, Date.now()),
  (errorData) => console.warn("rengeProcessingDebounce timer", errorData),
  () => console.log("Completed rengeProcessingDebounce timer!")
)
