import React from 'react';
import Css from './powerUserButton.module.css';
import { penIcon } from '../icons/icons';

function PowerUserButton({ onclickEvent }) {
    return (
        <button className={Css.button} onClick={onclickEvent}>{penIcon}</button>
    );
}

export default PowerUserButton;