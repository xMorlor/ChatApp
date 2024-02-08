import React from 'react';
import Css from './loadingComponent.module.css';

function LoadingComponent({ color }) {
    return (
        color === "black" ? <div class={Css.customLoaderBlack}></div>  
            : <div class={Css.customLoaderWhite}></div> 
    );
}

export default LoadingComponent;