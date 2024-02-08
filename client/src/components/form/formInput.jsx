import React from "react";
import Css from "./formInput.module.css";
import { useRef, useEffect } from "react";

function FormInput({
    formType,
    labelText,
    value,
    onChange,
    enterEvent,
    showOrHideChecklist,
    isPasswordInput,
}) {
    const ref = useRef(null);

    useEffect(() => {
        const handleEnterPress = (e) => {
            if (
                (e.key === "Enter" || e.keyCode === 13) &&
                formType === "password" &&
                enterEvent // prevence erroru při zmáčknutí enteru na prvním input fieldu pro heslo
            ) {
                enterEvent();
            }
        };

        const element = ref.current;

        const handleKeyUp = (e) => handleEnterPress(e);

        element.addEventListener("keyup", handleKeyUp);

        return () => {
            element.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div className={Css.wrapDiv}>
            <label className={Css.label} htmlFor={labelText}>
                {labelText}
            </label>

            <input
                className={Css.input}
                type={formType}
                id={labelText}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                ref={ref}
                onFocus={
                    isPasswordInput
                        ? () => {
                              showOrHideChecklist();
                          }
                        : null
                }
                onBlur={
                    isPasswordInput
                        ? () => {
                              showOrHideChecklist();
                          }
                        : null
                }
            />
        </div>
    );
}

export default FormInput;
