import './App.css';
import Header from './Components/Header/Header';
import Hamburger from './Components/Hamburger/Hamburger';
import { useEffect, useState } from 'react';

function App() {
  const [headerHidden, setHeaderHidden] = useState(true);
  const [tooSmall, setTooSmall] = useState(true);
  useEffect(() => {
    window.screen.width < 768 ? setTooSmall(true) : setTooSmall(false);
  }, [])
  const checkSize = () => {
    window.screen.width < 768 ? setTooSmall(true) : setTooSmall(false);
    tooSmall ? setHeaderHidden(false) : setHeaderHidden(true);
  }
  window.onresize = checkSize;
  return (
    <div className="App">
      <Header headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall} />
    </div>
  );
}

export default App;
