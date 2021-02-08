// ============== Worker logic here =============
const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads')

// adding summy delay of 15 seconds which is average of 5s and 25 seconds

console.log("hello from the worker thread")
parentPort.once('message', (message) => {
  parentPort.postMessage(message);
});
setTimeout(()=>{
  console.log("Hola after 15 sec")
}, 15000)