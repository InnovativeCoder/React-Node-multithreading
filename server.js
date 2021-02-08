const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const app = express();
const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads')

// ========= CORS only for dev ================
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev")); //logging the REST calls
}

// =============connecting to the database==============
mongoose.connect(
    `mongodb+srv://user1:${process.env.MONGO_PSWRD}@cluster0.pojut.mongodb.net/jobs?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  );
  
mongoose.connection.once("open", () => {
    console.log("Mongodb is succesfully connected");
});

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//================ api for initiating the workers===============
app.post('/api/worker', (req,res)=>{
  console.log("reached the server")
  const workers = []
  if(isMainThread){
    console.log("Hello from the main thread")
    //having 4 workers as of now, this may vary based upon the CPU
    while(workers.length < 4){
      const worker  = new Worker("./worker.js")
      worker.once('message', (message) => {
        console.log(message);  // Prints 'Hello, world!'.
      });
      worker.postMessage('Process started');
      workers.push(worker)
    }
  }else{
    console.log("error in the main")
  }
  res.json({message:"done"});
})

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});


app.listen(port, () => {
  console.log("Server is running on port:", port);
});