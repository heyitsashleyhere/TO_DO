import Welcome from "./components/Welcome.js";
import Homepage from "./components/Homepage.js";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/homepage" element={<Homepage />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
