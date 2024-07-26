import "./header.scss";
import React, { useState, useEffect } from 'react';
import { IconNames } from "@blueprintjs/icons";
import { Button, Icon, Intent } from "@blueprintjs/core";


const Header = () => {

  useEffect(() => {

    const user = JSON.parse(sessionStorage.getItem('userData'));
    console.log('header=>user:', user);
  });

  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleIconClick = () => {
    setPopupOpen(!isPopupOpen);
  };


  return (
    <div className='headerContainer'>
      <div className="header">
        <h1 className="text-white">Sensitive Data Annotation And Redaction</h1>
        <img src='https://ml.globenewswire.com/Resource/Download/2aa4c516-35e4-4892-b1fe-fb220116dddf' alt='prolifics' width='200px' height='50px' />
        <div className="popup-box">
          <Icon className="icon" icon={IconNames.User} size={30} onClick={handleIconClick} />
        </div>
      </div>
    </div>
  );
};

export default Header;
