import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './views/Home';
import Login from './views/Login';

function App() {
    // const [user, setUser] = useState<string>();

    // useEffect(() => {
    //     getUser();
    // }, []);

    // const c = user === undefined
    //     ? <div>User is no where to be found</div>
    //     : <div>
    //         <div>{user}</div>
    //         <div>User should be here ^^^</div>
    //     </div>

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
         </Router>
    );

    // async function getUser() {
    //     const response = await fetch('user/getfirstname');
    //     const data = await response.text();
    //     setUser(data);
    // }
}

export default App;