import React, { useState } from 'react';

const AccountMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hàm toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="account-menu">
            {/* Nút tài khoản, khi click sẽ toggle menu */}
            <button className="account-icon" onClick={toggleMenu}>
                <img src="path/to/user-icon.png" alt="Account Icon" />
            </button>

            {/* Dropdown menu, chỉ hiển thị khi isMenuOpen là true */}
            {isMenuOpen && (
                <div className="dropdown-menu">
                    <a href="#" className="menu-item">
                        <img src="path/to/manage-account-icon.png" alt="Manage My Account" />
                        Manage My Account
                    </a>
                    <a href="#" className="menu-item">
                        <img src="path/to/order-icon.png" alt="My Order" />
                        My Order
                    </a>
                    <a href="#" className="menu-item">
                        <img src="path/to/cancellations-icon.png" alt="My Cancellations" />
                        My Cancellations
                    </a>
                    <a href="#" className="menu-item">
                        <img src="path/to/reviews-icon.png" alt="My Reviews" />
                        My Reviews
                    </a>
                    <a href="#" className="menu-item">
                        <img src="path/to/logout-icon.png" alt="Logout" />
                        Logout
                    </a>
                </div>
            )}
        </div>
    );
};

export default AccountMenu;
