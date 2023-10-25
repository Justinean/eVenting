import react from 'react';
import './Home.css';
import exportColors from '../../Contexts/ColorsContext';
import AUTH from '../../utils/auth';

const Home = () => {
    return (
        <div className='Home'>
            {AUTH.loggedIn() ? <button className="registerEventButton HoverPointer" style={{backgroundColor: exportColors.Colors.Green}} onClick={() => window.location.assign("/createevent")}>Create an Event</button> : <></>}
            <h1>Home</h1>
            <input placeholder='Search by Location'></input>
            <br />
            <br />
        </div>
    )
}

export default Home;