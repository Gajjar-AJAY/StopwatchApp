import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Timer from "./Timer";
import Login from "./Login";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Timer" element={<Timer />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
