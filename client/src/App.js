import './App.css';
import Header from './Components/Header/Header';
import Hamburger from './Components/Hamburger/Hamburger';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './Components/NotFound/NotFound';
import Home from './Components/Home/Home';
import SignIn from './Components/SignIn/SignIn';
import exportColors from './Contexts/ColorsContext';
import SignUp from './Components/SignUp/SignUp';

function App() {
  const headerScaleValue = 10;
  const [headerHidden, setHeaderHidden] = useState(false);
  const [tooSmall, setTooSmall] = useState(true);
  const [headerWidth, setHeaderWidth] = useState(window.screen.width / headerScaleValue)
  useEffect(() => {
    window.screen.width < 768 ? setTooSmall(true) : setTooSmall(false);
  }, [])
  const checkSize = () => {
    window.screen.width < 768 ? setTooSmall(true) : setTooSmall(false);
    tooSmall ? setHeaderHidden(false) : setHeaderHidden(true);
    setHeaderWidth(window.screen.width / headerScaleValue);
    console.log(headerWidth);
  }


  window.onresize = checkSize;
  return (
    <div className="App">
      <exportColors.ColorsContext.Provider value={exportColors.Colors}>
        <Header headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall} headerWidth={headerWidth} headerScaleValue={headerScaleValue} />
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/signin" exact element={<SignIn tooSmall={tooSmall}/>} />
            <Route path="/signup" exact element={<SignUp tooSmall={tooSmall}/>} />
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
