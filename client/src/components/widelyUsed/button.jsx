import React from 'react';
import Css from './button.module.css';

function Button({ text, onclickEvent }) {
    return (
        <button className={Css.button} onClick={onclickEvent}>{text}</button>
    );
}

export default Button;