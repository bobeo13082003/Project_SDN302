import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DropdownMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [
     
        { name: 'Test', path: '/test' },
        { name: 'Learn', path: '/learn' },
        { name: 'Flash Card', path: '/flash-card-question' },
        { name: 'Match Card', path: '/match-card' },
        { name: 'Home', path: '/' },
    ];
    return (
        <div>
            <select
                value={location.pathname} 
                onChange={(e) => navigate(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '2px solid #d9d9d9' ,fontSize:"16px"}} 
            >
                {menuItems.map((item) => (
                    <option style={{color:"black",fontSize:"16px",backgroundColor:"#d9d9d9"}} key={item.path} value={item.path}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default DropdownMenu;
