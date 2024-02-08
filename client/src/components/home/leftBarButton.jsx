import React from 'react';
import Css from './leftBarButton.module.css';

function LeftBarButton({ onClickEvent, icon, active }) {
    const iconColor = {
        fill: active ? 'white' : 'gray',
    };
    
    return (
        <div className={Css.buttonLeftBar} onClick={onClickEvent}>
            {active ? 
                React.cloneElement(icon, { style: iconColor }) : 
                icon    
            }
        </div>
    );
}

export default LeftBarButton;