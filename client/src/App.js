import axios from "axios";
import './App.css';

function App() {
  const handleClick = () =>{
    axios
    .post("/api/worker")
    .then((res)=>{
      console.log("Worker started")
    })
  }
  return (
    <div className="App">
      <button onClick={handleClick} className="button">
        Create a new job
      </button>
    </div>
  );
}

export default App;
