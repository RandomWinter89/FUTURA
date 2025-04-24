
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Homepage from "./pages/Homepage";

//Version 1
function App() {

  return (
    <Provider store={store}>
      <Homepage />
    </Provider>
  ) 
}

export default App
