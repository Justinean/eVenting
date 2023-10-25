import './App.css';
import Header from './Components/Header/Header';
import Hamburger from './Components/Hamburger/Hamburger';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import SignIn from './Pages/SignIn/SignIn';
import exportColors from './Contexts/ColorsContext';
import SignUp from './Pages/SignUp/SignUp';
import CreateEvent from './Pages/CreateEvent/CreateEvent';

function App() {
  const headerScaleValue = 10;
  const [headerHidden, setHeaderHidden] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [headerWidth, setHeaderWidth] = useState(window.screen.width / headerScaleValue);
  const [transition, setTransition] = useState("");
  useEffect(() => {
    window.screen.width < 768 ? setTooSmall(true) : setTooSmall(false);
    tooSmall ? setHeaderHidden(true) : setHeaderHidden(false);
  }, [tooSmall])
  const checkSize = () => {
    setTimeout(() => setTransition("all 0.4s ease-in-out"), 100);
    setTransition("")
    window.screen.width < 768 ? setTooSmall(true) : setTooSmall(false);
    tooSmall ? setHeaderHidden(true) : setHeaderHidden(false);
    if (!tooSmall) setHeaderWidth(window.screen.width / headerScaleValue);
    console.log(headerWidth);
  }




  window.onresize = checkSize;
  return (
    <div className="App">
      <exportColors.ColorsContext.Provider value={exportColors.Colors}>
        <Header headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall} headerWidth={headerWidth} headerScaleValue={headerScaleValue} transition={transition}/>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/signin" exact element={<SignIn tooSmall={tooSmall}/>} />
            <Route path="/signup" exact element={<SignUp tooSmall={tooSmall}/>} />
            <Route path="/createevent" exact element={<CreateEvent tooSmall={tooSmall}/>} />
            {/*<Route path="/about" element={About} />
            <Route path="/contact" element={Contact} />*/}
            <Route element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ exportColors.ColorsContext.Provider>
    </div>
  );
}

export default App;
