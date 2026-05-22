
/* =========================================
   XUI Reactive State + Computed + Store
========================================= */

export function createState(initialValue) {
  let value = initialValue;
  const subscribers = [];

  function notify() {
    subscribers.forEach(cb => cb(value));
  }

  return {
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      notify();
    },
    update(updater) {
      value = updater(value);
      notify();
    },
    subscribe(cb) {
      subscribers.push(cb);
    }
  };
}

/* ========================
   COMPUTED VALUES
======================== */

export function computed(state, computeFn) {
  const derived = createState(computeFn(state.get()));

  state.subscribe(() => {
    derived.set(computeFn(state.get()));
  });

  return derived;
}

/* ========================
   GLOBAL STORE
======================== */

export function createStore(initialState) {
  return createState(initialState);
}
