import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import Home from './views/Home';
import Login from './views/Login';
import CustomAppBar from './components/CustomAppBar';
import Reservations from './views/Reservations';
import Account from './views/Account';
import Location from './views/Location';
import Admin from './views/admin/Admin';

function LocationWrapper() {
    const { id } = useParams<{ id: string }>();
    return <Location locationId={id} />;
}

function App(): JSX.Element {
    return (
        <Router>
            <CustomAppBar />
            {/* Use Box to keep it centered */}
            <Box sx={{ width: '100vw' }}> 
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/reservations" element={<Reservations/>} />
                    <Route path="account" element={<Account/>} />
                    <Route path="/location/:id?" element={<LocationWrapper />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Box>
        </Router>
    );
}

export default App;