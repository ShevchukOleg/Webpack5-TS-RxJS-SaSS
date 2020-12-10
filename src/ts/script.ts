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

// Observer patern

interface Listener {
  name: string;
  next(message: string): void;
}

class Producer {
  private listeners: Array<Listener> = [];

  public subscribe(listener: Listener) {
    let listenersLength = this.listeners.push(listener);

    return {
      unsubscribe: (listener: Listener) => {
        this.listeners = this.listeners.filter((element: Listener) => {
          return element.name !== listener.name
        })
      }
    }
  }

  public notify(message: string) {
    this.listeners.forEach(listener => listener.next(message))

  }
}

const notifier = new Producer();

const listener_1 = {
  name: 'listener_1',
  next(message: string) {
    console.warn(this.name, message);
  }
}

const listener_2 = {
  name: 'listener_2',
  next(message: string) {
    console.warn(this.name, message);
  }
}

const sub_1 = notifier.subscribe(listener_1);
const sub_2 = notifier.subscribe(listener_2);

notifier.notify("Notifier works");

sub_1.unsubscribe(listener_1);

setTimeout(() => {
  notifier.notify("Second packet");
}, 3000)
import { ajax } from 'rxjs/ajax';
import { fromEvent, of, from, timer, interval, range, empty, throwError, combineLatest, zip, forkJoin, concat, merge, race, iif, defer, Subscriber, Unsubscribable, pipe } from 'rxjs';
import { switchMap, debounceTime, filter, ignoreElements, first, last, single, find, debounce, distinctUntilChanged, throttle, throttleTime, auditTime, audit, skip, skipUntil, take, takeUntil, takeWhile, map, mergeMap, startWith, withLatestFrom, pairwise, pluck, mapTo, reduce, scan, flatMap, concatMap, retry, retryWhen, delay, exhaust } from 'rxjs/operators'
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
      const interval = setInterval(_ => {
        (counter === 3) ? unsubscribe_2() : null;
        if (counter >= 21) {
          clearInterval(interval);
          observer.complete()
        }
        observer.next(counter++);
      }, 300);
    } catch (err) {
      observer.error(err);
    }
  }
)


const subscription_1 = observable_1.subscribe(
  (nextData) => console.log("observable_1:", nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed observable_1 !")
);

const subscription_2 = observable_1.subscribe(
  (nextData) => console.log("observable_2:", nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed observable_2 !")
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
  () => console.warn("Completed observable_2 !")
);

const observable_3 = from([1, 3, 15, 67, 33, 92]);

observable_3.subscribe(
  (nextData) => console.log(nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed observable_3 !")
);

const observable_from_Promise = from(Promise.resolve(777));
observable_from_Promise.subscribe(
  (nextData) => console.log(nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed observable_from_Promise !")
);

const observable_timer = timer(0, 400)
const observable_interval = interval(100);
// observable_interval.subscribe(
//   (nextData) => console.log(nextData),
//   (errorData) => console.warn(errorData),
//   () => console.warn("Completed observable_interval!")
// );

// observable_timer.subscribe(
//   (nextData) => console.log(nextData),
//   (errorData) => console.warn(errorData),
//   () => console.warn("Completed observable_2 !")
// );

const observable_range = range(0, 11);
observable_range.subscribe(
  (nextData) => console.log("Range observer:", nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed observable_range !")
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
  () => console.warn("Completed observable_empty !")
);

let random = Math.random() * 100;

const decider = iif(
  () => {
    return random >= 51;
  },
  of('more than 50'),
  of('less then 50')
);

decider.subscribe((resolution) => {
  console.log(resolution);
})

const complexDecider = defer(function () {
  if (random <= 50) {
    return of('Bad result')
  } else if (random <= 80) {
    return of('Not bad, not bad now you')
  } else {
    return of('Excellent')
  }
});

complexDecider.subscribe(
  (nextData) => console.log("ComplexDecider observer:", nextData),
  (errorData) => console.error('ComplexDecider error:', errorData),
  () => console.warn("Completed complexDecider!")
)

//____________________Pipe and Intermediate data processing
// first, last, single
const rengeProcessing = observable_range.pipe(
  filter((value) => {
    return value > 5;
  })
).subscribe(
  (value) => console.log('Filtering renge', value)
)

const rengeProcessing_distinctUntilChanged = from([13, 13, 13, 16, 9, 25, 9, 9, 16, 25, 13]).pipe(
  distinctUntilChanged()
).subscribe(
  (nextData) => console.log("distinctUntilChanged", nextData),
  (errorData) => console.warn(errorData),
  () => console.warn("Completed distinctUntilChanged!")
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
  () => console.warn("Completed rengeProcessing_2 !")
)

const rengeProcessingDebounce_interval = observable_range.pipe(
  debounce(() => interval(500))
).subscribe(
  (nextData) => console.log("rengeProcessingDebounce:", nextData),
  (errorData) => console.warn("rengeProcessingDebounce", errorData),
  () => console.warn("Completed rengeProcessingDebounce!")
)

const rengeProcessingDebounce_timer = interval(1000).pipe(
  debounce(() => timer(999))
).subscribe(
  (nextData) => console.log("rengeProcessingDebounce timer:", nextData, Date.now()),
  (errorData) => console.warn("rengeProcessingDebounce timer", errorData),
  () => console.warn("Completed rengeProcessingDebounce timer!")
)

const intervalProcessingDebouncetTime = interval(1000).pipe(
  debounceTime(999)
).subscribe(
  (nextData) => console.log("rengeProcessingDebouncetTime:", nextData, Date.now()),
  (errorData) => console.warn("rengeProcessingDebouncetTime", errorData),
  () => console.warn("Completed rengeProcessingDebouncetTime!")
)

const timerProcessing_throttleTime = timer(0, 200).pipe(
  throttleTime(600)
).subscribe(
  (nextData) => console.log("timerProcessing_throttleTime:", nextData, Date.now()),
  (errorData) => console.warn("timerProcessing_throttleTime", errorData),
  () => console.warn("Completed timerProcessing_throttleTime!")
)

const timerProcessing_throttle = timer(0, 200).pipe(
  throttle(ev => interval(600))
).subscribe(
  (nextData) => console.log("timerProcessing_throttle:", nextData, Date.now()),
  (errorData) => console.warn("timerProcessing_throttle", errorData),
  () => console.warn("Completed timerProcessing_throttle!")
)

const timerProcessing_audit = timer(0, 200).pipe(
  audit(ev => interval(600))
).subscribe(
  (nextData) => console.log("timerProcessing_audit:", nextData, Date.now()),
  (errorData) => console.warn("timerProcessing_audit", errorData),
  () => console.warn("Completed timerProcessing_audit!")
)


const fromProcessing_skip = from([1, 3, 5, 8, 13, 30]).pipe(
  skip(3)
).subscribe(
  (value) => console.log('fromProcessing_skip:', value),
  (error) => console.warn('fromProcessing_skip:', error),
  () => console.warn("Completed fromProcessing_skip!")
)

const intervalProcessing_skipUntil = interval(1000).pipe(
  skipUntil(timer(1500, 1000))
).subscribe(
  (value) => console.log('intervalProcessing_skipUntil:', value),
  (error) => console.warn('intervalProcessing_skipUntil:', error),
  () => console.warn("Completed intervalProcessing_skipUntil!")
)

const intervalProcessing_take = interval(1000).pipe(
  take(5)
).subscribe(
  (value) => console.log('intervalProcessing_take:', value),
  (error) => console.warn('intervalProcessing_take:', error),
  () => console.warn("Completed intervalProcessing_take!")
)

const intervalProcessing_takeUntil = interval(500).pipe(
  takeUntil(timer(3600))
).subscribe(
  (value) => console.log('intervalProcessing_takeUntil:', value),
  (error) => console.warn('intervalProcessing_takeUntil:', error),
  () => console.warn("Completed intervalProcessing_takeUntil!")
)

const intervalProcessing_takeWhile = interval(500).pipe(
  takeWhile((value: number) => {
    return value < 10
  })
).subscribe(
  (value) => console.log('intervalProcessing_takeWhile:', value),
  (error) => console.warn('intervalProcessing_takeWhile:', error),
  () => console.warn("Completed intervalProcessing_takeWhile!")
)

// Комбынування Observable
const timer_1 = timer(1000, 4000).pipe(take(3));
const timer_2 = timer(2000, 4000).pipe(take(3));
const timer_3 = timer(3000, 4000).pipe(take(3));


const combineLatestExemple = combineLatest(timer_1, timer_2, timer_3);
combineLatestExemple.subscribe({
  next: (value: Array<number>) => console.log('CombineLatestExemple next:', value),
  complete: () => console.warn('Complete: combineLatestExemple'),
  error: (error) => console.log('Error', error)
});

const combineLatestProjectExemple = combineLatest(timer_1, timer_2, timer_3).pipe(
  map(
    ([a, b, c]) => {
      console.log(a, b, c);
      return a + b + c;
    }
  ));

combineLatestProjectExemple.subscribe({
  next: (value: number) => console.log('combineLatestProjectExemple next:', value),
  complete: () => console.warn('Complete: combineLatestProjectExemple'),
  error: (error) => console.log('Error', error)
});

const zipExemple = zip(timer_1, timer_2, timer_3);
zipExemple.subscribe({
  next: (value: Array<number>) => console.log('zipExemple next:', value),
  complete: () => console.warn('Complete: zipExemple'),
  error: (error) => console.log('Error', error)
});

const zipPostFuncExemple = zip(timer_1, timer_2, timer_3).pipe(
  map(([a, b, c]) => {
    return { first: a, second: b, third: c };
  })
);
zipPostFuncExemple.subscribe({
  next: (value: any) => console.log('zipPostFuncExemple next:', value),
  complete: () => console.warn('Complete: zipPostFuncExemple'),
  error: (error) => console.log('Error', error)
});


const forkJoinExemple = forkJoin(timer_1, timer_2, timer_3);
forkJoinExemple.subscribe({
  next: (value: any) => console.log('forkJoinExemple next:', value),
  complete: () => console.warn('Complete: forkJoinExemple'),
  error: (error) => console.log('Error forkJoinExemple', error)
});

const timer_4 = timer(1000, 100).pipe(take(3));

const concatObservable = concat(timer_1, timer_4);
concatObservable.subscribe({
  next: (value: any) => console.log('concatObservable next:', value),
  complete: () => console.warn('Complete: concatObservable'),
  error: (error) => console.log('Error concatObservable', error)
});

const mergeObservable = merge(timer_1.pipe(take(3)), timer_4.pipe(take(2)));
concatObservable.subscribe({
  next: (value: any) => console.log('mergeObservable next:', value),
  complete: () => console.warn('Complete: mergeObservable'),
  error: (error) => console.log('Error mergeObservable', error)
});

const mergeMapExemple = timer_4.pipe(
  mergeMap(value => of('ok - ', 'off - ', 'refused - ').pipe(
    map((prefix: string) => {
      return prefix + value;
    })
  )));

mergeMapExemple.subscribe({
  next: (value: any) => console.log('mergeMapExemple next:', value),
  complete: () => console.warn('Complete: mergeMapExemple'),
  error: (error) => console.log('Error mergeMapExemple', error)
});

const inputSequence = fromEvent(input_2, 'input');
const mergeMapExemple_2 = inputSequence.pipe(
  debounceTime(600),
  mergeMap(
    (event: KeyboardEvent) => {
      const value = (event.target as HTMLInputElement).value;
      return ajax(`https://api.github.com/search/repositories?q=${value}`);
    }
  ),
  pluck('response')
);

mergeMapExemple_2.subscribe({
  next: (value: any) => console.log('mergeMapExemple_2 next:', value),
  complete: () => console.warn('Complete: mergeMapExemple_2'),
  error: (error) => console.log('Error mergeMapExemple_2', error)
});

const startWithExemple = of('Main observable start', 'Main observable works', 'Main observable finsh').pipe(
  startWith('Before starting observsble', 'Lets start')
);

startWithExemple.subscribe(
  {
    next: (value: any) => console.log('startWithExemple next:', value),
    complete: () => console.warn('Complete: startWithExemple'),
    error: (error) => console.log('Error startWithExemple', error)
  }
)

const withLatestFromExemple = timer_1.pipe(
  withLatestFrom(timer_3)
);

withLatestFromExemple.subscribe(
  {
    next: (value: any) => console.log('withLatestFromExemple next:', value),
    complete: () => console.warn('Complete: withLatestFromExemple'),
    error: (error) => console.log('Error withLatestFromExemple', error)
  }
)

const pairwiseExemple = timer(500, 250).pipe(
  take(8),
  pairwise()
)

pairwiseExemple.subscribe(
  {
    next: (value: any) => console.log('pairwiseExemple next:', value),
    complete: () => console.warn('Complete: pairwiseExemple'),
    error: (error) => console.log('Error pairwiseExemple', error)
  }
)

const racer_1 = timer(5, 100).pipe(take(2), map(value => 'racer1'));
const racer_2 = timer(0, 100).pipe(take(2), map(value => 'racer2'));

const racing = race(racer_1, racer_2);

racing.subscribe(
  {
    next: (value: any) => console.log('racing next:', value),
    complete: () => console.warn('Complete: racing'),
    error: (error) => console.log('Error racing', error)
  }
)

const pluckExemple = of({ id: 1, name: 'John' }, { id: 2, name: 'Mary' }).pipe(
  pluck('name')
);

pluckExemple.subscribe(
  {
    next: (value: any) => console.log('pluckExemple:', value),
    complete: () => console.warn('Complete: pluckExemple'),
    error: (error) => console.log('Error pluckExemple', error)
  }
)

const pulsar = timer(100, 250).pipe(
  mapTo(1),
  takeUntil(
    interval(1250)
  )
)

pulsar.pipe(
  reduce((ac, value) => ac + value, 0)
).subscribe(
  {
    next: (value: any) => console.log('Reduce result:', value),
    complete: () => console.warn('Complete: reduce'),
    error: (error) => console.log('Error reduce', error)
  }
)

pulsar.pipe(
  scan((ac, value) => ac + value, 0)
).subscribe(
  {
    next: (value: any) => console.log('Scan result:', value),
    complete: () => console.warn('Complete: scan'),
    error: (error) => console.error('Error scan', error)
  }
)

const mapExemple = of(20, 16, 19, 22, 18, 24).pipe(
  map((value) => {
    return Math.abs((20 - value) / 20);
  })
).subscribe(
  {
    next: (value: any) => console.log('Map result:', value),
    complete: () => console.warn('Complete: map'),
    error: (error) => console.error('Error map', error)
  }
)

const flatMapExample = timer(100, 500).pipe(
  take(5),
  flatMap(_ => of('a', 'b', 'c', 'd'))
);

flatMapExample.subscribe(
  {
    next: (value: any) => console.log('FlatMapExample result:', value),
    complete: () => console.warn('Complete:  flatMapExample'),
    error: (error) => console.error('Error  flatMapExample', error)
  }
)

const switchMapExemple = of(2, 5, 10).pipe(
  switchMap((value, i) => {
    return of(value, value ** 2, value ** 3)
  })
);

switchMapExemple.subscribe(
  {
    next: (value: any) => console.log('SwitchMapExemple result:', value),
    complete: () => console.warn('Complete:  switchMapExemple'),
    error: (error) => console.error('Error  switchMapExemple', error)
  }
)

const concatMapExemple = of(2, 5, 10).pipe(
  concatMap((value, i) => {
    return of(value, value ** 2, value ** 3)
  })
);

concatMapExemple.subscribe(
  {
    next: (value: any) => console.log('ConcatMapExemple result:', value),
    complete: () => console.warn('Complete:  concatMapExemple'),
    error: (error) => console.error('Error  concatMapExemple', error)
  }
)

const higherOrderObs = interval(Math.random() * 300).pipe(
  map((value) => interval(1000).pipe(take(5)))
);

const exhaustExample = higherOrderObs.pipe(exhaust());
exhaustExample.subscribe(
  {
    next: (value: any) => console.log('exhaustExample result:', value),
    complete: () => console.warn('Complete:  exhaustExample'),
    error: (error) => console.error('Error  exhaustExample', error)
  }
);


const throwErrorExemple = interval(100).pipe(
  mergeMap((value) => {
    return (value >= 5) ? throwError('Error massege') : of(value)
  }),
  // retry(2),
  retryWhen((errorObservable) => {
    console.error(errorObservable);
    return errorObservable.pipe(delay(650));
  })
)

throwErrorExemple.subscribe(
  {
    next: (value: any) => console.log('ThrowErrorExemple:', value),
    complete: () => console.warn('Complete: throwErrorExemple'),
    error: (error) => console.error('Error throwErrorExemple:', error)
  }
)


// Створення валасного оператору
// ** 1 -- Створення простого дублюючого оператору
function doNothing(sourceObs: Observable<any>) {
  return sourceObs;
}

interval(500).pipe(
  take(10),
  doNothing
).subscribe(
  {
    next: (value: any) => console.log('Test doNothing operator:', value),
    complete: () => console.warn('Complete: doNothing operator'),
    error: (error) => console.error('Error doNothing operator:', error)
  }
)

// ** Оператор множення на 2
// !! тара методика, яку замінив новий оператор
class DoubleSubscriber extends Subscriber<number> {
  next(value?: number): void {
    super.next(value * 2)
  }
}

function doubleOperator(sourceObs$: Observable<any>) {
  const outObservable = new Observable();
  outObservable.source = sourceObs$;
  outObservable.operator = {
    call(subscriber: Subscriber<unknown>, source: any): Unsubscribable | Function | void {
      source.subscribe(new DoubleSubscriber(subscriber))
    }
  }
  return outObservable;
}

function doubleOperator_lift(sourceObs$: Observable<any>) {
  return sourceObs$.lift(
    {
      call(subscriber: Subscriber<unknown>, source: any): Unsubscribable | Function | void {
        source.subscribe(new DoubleSubscriber(subscriber))
      }
    }
  )
}

timer(1500, 1000).pipe(
  doubleOperator
).subscribe(
  {
    next: (value: any) => console.log('Test doubleOperator operator:', value),
    complete: () => console.warn('Complete: doubleOperator operator'),
    error: (error) => console.error('Error doubleOperator operator:', error)
  }
)
// ?? приймає декілька функцій, повертає функцію яка приймає source: Observable<any> і вже вонаповертає резльтат обробки переліку вхідних функцій
const pipeAnalog = (...fns: Function[]) => {
  console.warn('pipeAnalog fns:', fns)
  return (source: Observable<any>) => {
    return fns.reduce(
      (newSourse, fn) => {
        return fn(newSourse)
      },
      source
    )
  }
};

const operatorCombination = pipe(
  filter((value: number) => value % 2 === 0),
  doubleOperator_lift
)

const operatorCombination_2 = pipeAnalog(
  filter((value: number) => value % 2 === 0),
  doubleOperator_lift
)


timer(1500, 1000).pipe(
  operatorCombination_2
).subscribe(
  {
    next: (value: any) => console.log('Test operatorCombination operator:', value),
    complete: () => console.warn('Complete: operatorCombination operator'),
    error: (error) => console.error('Error operatorCombination operator:', error)
  }
)


// ** Кастомний оператор що пропускає задану кількість пакетів і потів видає вказану кількість

class skipProvideSubscriber extends Subscriber<any> {
  private count = 1;
  private section = 1;

  constructor(
    subscriber: Subscriber<any>,
    private skip: number,
    private provide: number
  ) {
    super(subscriber)
  }

  next(value?: any): void {
    const lowerLimit = this.section * (this.skip + this.provide) - this.provide;
    const upperLimit = lowerLimit + this.provide;
    if (lowerLimit < this.count && this.count <= upperLimit) {
      this.count++;
      super.next(value)
      if (this.count > upperLimit) {
        this.section++;
      }
      return
    }
    this.count++;
  }
}

function skipProvide(skip: number, provide: number) {
  return (source$: Observable<any>) => {
    return source$.lift(
      {
        call(subscriber: Subscriber<unknown>, source: any): Unsubscribable | Function | void {
          source.subscribe(new skipProvideSubscriber(subscriber, skip, provide))
        }
      }
    )
  }
}

interval(500).pipe(
  skipProvide(5, 2)
).subscribe(
  {
    next: (value: any) => console.warn('Test skipProvide operator:', value),
    complete: () => console.warn('Complete: skipProvide operator'),
    error: (error) => console.error('Error skipProvide operator:', error)
  }
)