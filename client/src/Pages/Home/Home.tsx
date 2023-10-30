import './Home.css';
import { ColorsContext } from '../../Contexts';
import AUTH from '../../utils/auth';
import { useContext, useEffect } from 'react';

const Home = () => {
    const Colors = useContext(ColorsContext);
    useEffect(() => {
        document.title = "Home - eVenting"
    }, [])
    return (
        <div className='Home'>
            {AUTH.loggedIn() ? <button className="registerEventButton HoverPointer" style={{backgroundColor: Colors.Green}} onClick={() => window.location.assign("/event/create")}>Create an Event</button> : <></>}
            <h1>Home</h1>
            <input placeholder='Search by Location'></input>
            <br />
            <br />
        </div>
    )
}

export default Home;