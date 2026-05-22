
let mountQueue = [];

export function onMount(callback) {
  mountQueue.push(callback);
}

export function runMounts() {
  mountQueue.forEach(cb => cb());
  mountQueue = [];
}
