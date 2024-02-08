import Css from './option.module.css';
import React from 'react';

function Option({ text, icon, clickEvent }) {
    
    return (
        <div className={Css.option} onClick={clickEvent}>
            <div className={Css.optionIcon}>{React.cloneElement(icon, { style:{ fill: "#242424", width: "24", height: "24" } })}</div>
            <div className={Css.optionText}>{text}</div>
        </div> 
    );
}

export default Option;