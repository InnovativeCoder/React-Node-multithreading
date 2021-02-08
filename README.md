# JS is Single Threaded !! No More ❌ ❌ ❌

Until now we all have heard this that JavaScript is single threaded. Even I have learnt this only, but with node.js 10.5 update, there was a little change.

While there was asynchronous JavaScript provided by Browser APIs which uses microtask queue and callback queue, to make our jobs easier, comes to rescue worker threads.

Being single threaded, JS was used to run everything on main thread, creators were not happy from this behavious, hence introduced worker threads.

A lot of times you might have seen this error:

<img src="https://errortools.com/wp-content/uploads/2014/04/unresponsive-script.jpg"/>

This happens as when some high calculation is to happen, it happens onthe cost of rendering the UI,. So UI stops rendering and hence this calculation is processed.

<i>Opinion -

A performance hack you can use is useMemo hook in react.js which does the calculation only once and if it needs to be calculated again it doesn't process that operation, instead use the old value until and unless some input changes from the dependancy array.
</i>

Coming back to the point. Let's say we are having some data extensive calculation which needs to be processed, now in this situation these worker threads wll be a boom.

How?

They help fragmenting the data into chunks which can be used by different threads in forms of sharedarraybuffers, and after processing inidividually they all can be accumulated to form the solution.

Some basic terminologies for workers :

- `ArrayBuffers` to transfer memory from one thread to another
- `SharedArrayBuffer` that will be accessible from either thread. It lets you share memory between threads (limited to binary data).
- `Atomics` available, it lets you do some processes
  concurrently, more efficiently and allows you to implement conditions
  variables in JavaScript
- `MessagePort`, used for communicating between different
  threads. It can be used to transfer structured data, memory regions and
  other MessagePorts between different Workers.
- `MessageChannel` represents an asynchronous, two-way communications channel used for communicating between different threads.
- `WorkerData` is
  used to pass startup data. An arbitrary JavaScript value that contains a clone of the data passed to this thread’s Worker constructor. The data
  is cloned as if using `postMessage()`

APIs node.js provides:

- `const { worker, parentPort } = require(‘worker_threads’)` => The `worker` class represents an independent JavaScript execution thread and the `parentPort` is an instance of the message port
- `new Worker(filename)` or `new Worker(code, { eval: true })` => are the two main ways of starting a worker (passing the filename
  or the code that you want to execute). It’s advisable to use the
  filename in production.
- `worker.on(‘message’)`, `worker/postMessage(data)` => for listening to messages and sending them between the different threads.
- `parentPort.on(‘message’)`, `parentPort.postMessage(data)` => Messages sent using `parentPort.postMessage()` will be available in the parent thread using `worker.on('message')`, and messages sent from the parent thread using `worker.postMessage()` will be available in this thread using `parentPort.on('message')`.

You can undestand the basic CRUD operations of worker threads using:

<pre>
    const {
      Worker, isMainThread, parentPort, workerData
    } = require('worker_threads');

    if (isMainThread) {
      module.exports = function parseJSAsync(script) {
        return new Promise((resolve, reject) => {
          const worker = new Worker(filename, {
            workerData: script
          });
          worker.on('message', resolve);
          worker.on('error', reject);
          worker.on('exit', (code) => {
            if (code !== 0)
              reject(new Error(`Worker stopped with exit code ${code}`));
          });
        });
      };
    } else {
      const { parse } = require('some-js-parsing-library');
      const script = workerData;
      parentPort.postMessage(parse(script));
    }
</pre>

It requires:

- `Worker`: the class that represents an independent JavaScript execution thread.
- `isMainThread`: a boolean that is true if the code is not running inside of a Worker thread.
- `parentPort`: the MessagePort allowing communication with the parent thread If this thread was spawned as a Worker.
- `workerData`: An arbitrary JavaScript value that contains a clone of the data passed to this thread’s Worker constructor.

In actual practice for these kinds of tasks, use a pool of Workers
instead. Otherwise, the overhead of creating Workers would likely exceed
their benefit.
