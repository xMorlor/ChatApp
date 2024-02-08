import React, { Component } from "react";
import FormInput from "../components/form/formInput";
import Button from "../components/widelyUsed/button";
import { checkIfSessionExists } from "../utilities/session";
import { signUp } from "../utilities/authentication";
import Css from "./RegisterForm.module.css";
import Gap from "../components/form/gap";
import GapSmall from "../components/form/gapSmall";
import PasswordChecklist from "react-password-checklist";
import { Toaster, toast } from "sonner";

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            checklistIsShown: false,
        };
    }

    componentDidMount() {
        try {
            checkIfSessionExists("/register");
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    onInputChange = (event, inputName) => {
        this.setState({ [inputName]: event });
    };

    handleSignUp = async () => {
        const { username, password, confirmPassword } = this.state;

        const result = await signUp(username, password, confirmPassword);

        if (result === "Success") {
            window.location.href = "/home";
        } else {
            toast.error(result);
        }
    };

    showOrHideChecklist = () => {
        this.setState((prevState) => ({
            checklistIsShown: !prevState.checklistIsShown,
        }));
    };

    render() {
        var { username, password, confirmPassword, checklistIsShown } =
            this.state;

        return (
            <div className={Css.body}>
                <Toaster richColors />
                <div className={Css.wrapDiv}>
                    <div className={Css.header}>Sign Up</div>
                    <FormInput
                        formType="text"
                        labelText="Username"
                        value={username}
                        onChange={(event) =>
                            this.onInputChange(event, "username")
                        }
                    />

                    <FormInput
                        formType="password"
                        labelText="Password"
                        value={password}
                        onChange={(event) =>
                            this.onInputChange(event, "password")
                        }
                        showOrHideChecklist={this.showOrHideChecklist}
                        isPasswordInput={true}
                    />

                    {checklistIsShown ? (
                        <PasswordChecklist
                            rules={[
                                "lowercase",
                                "capital",
                                "number",
                                "minLength",
                                "maxLength",
                            ]}
                            minLength={6}
                            maxLength={16}
                            value={password}
                            valueAgain={confirmPassword}
                            onChange={(isValid) => {}}
                            className={Css.checklist}
                        />
                    ) : null}

                    <FormInput
                        formType="password"
                        labelText="Confirm password"
                        value={confirmPassword}
                        onChange={(event) =>
                            this.onInputChange(event, "confirmPassword")
                        }
                        enterEvent={this.handleSignUp}
                    />

                    <Gap />

                    <Button onclickEvent={this.handleSignUp} text="Sign Up" />
                    <GapSmall />
                </div>
            </div>
        );
    }
}

export default RegisterForm;
