import './App.css';
import Header from './Components/Header/Header';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import SignIn from './Pages/SignIn/SignIn';
import { Colors } from './Contexts/ColorsContext';
import { SmallStyle } from './Contexts/SmallStyleContext';
import { ColorsContext, SmallStyleContext } from './Contexts';
import SignUp from './Pages/SignUp/SignUp';
import CreateEvent from './Pages/CreateEvent/CreateEvent';
import UserPages from './Pages/UserPages/UserPages';
import CreatePost from './Pages/CreatePost/CreatePost';

function App() {
  const headerScaleValue = .1;
  const [headerHidden, setHeaderHidden] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [headerWidth, setHeaderWidth] = useState(window.innerWidth * headerScaleValue);
  const [transition, setTransition] = useState("");
  useEffect(() => {
    window.innerWidth < 768 ? setTooSmall(true) : setTooSmall(false);
    tooSmall ? setHeaderHidden(true) : setHeaderHidden(false);
  }, [tooSmall])
  const checkSize = () => {
    setTimeout(() => setTransition("all 0.4s ease-in-out"), 100);
    setTransition("")
    window.innerWidth < 768 ? setTooSmall(true) : setTooSmall(false);
    tooSmall ? setHeaderHidden(true) : setHeaderHidden(false);
    if (!tooSmall) setHeaderWidth(window.innerWidth * headerScaleValue);
    console.log(headerWidth);
  }

  window.onresize = checkSize;

  return (
    <div className="App">
      <SmallStyleContext.Provider value={SmallStyle}>
        <ColorsContext.Provider value={Colors}>
          <Header headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall} headerWidth={headerWidth} transition={transition}/>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn tooSmall={tooSmall}/>} />
              <Route path="/signup" element={<SignUp tooSmall={tooSmall}/>} />
              <Route path="/event/create" element={<CreateEvent/>} />
              <Route path="/post/create" element={<CreatePost/>} />
              <Route path="/user/:id" element={<UserPages tooSmall={tooSmall}/>} />
              {/*<Route path="/about" element={About} />
              <Route path="/contact" element={Contact} />*/}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ ColorsContext.Provider>
      </ SmallStyleContext.Provider>
    </div>
  )
}

export default App
