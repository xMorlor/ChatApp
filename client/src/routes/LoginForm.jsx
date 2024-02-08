import FormInput from "../components/form/formInput";
import Button from "../components/widelyUsed/button";
import NotMemberLink from "../components/form/notMember";
import { Component } from "react";
import { checkIfSessionExists } from "../utilities/session";
import Css from "./LoginForm.module.css";
import Gap from "../components/form/gap";
import { Toaster, toast } from "sonner";
const authUtils = require("../utilities/authentication");

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    onInputChange = (event, inputName) => {
        this.setState({ [inputName]: event });
    };

    signIn = async () => {
        const { username, password } = this.state;

        const result = await authUtils.login(username, password);

        if (result === "Success") {
            window.location.href = "/home";
        } else {
            toast.error(result);
        }
    };

    async componentDidMount() {
        try {
            checkIfSessionExists("/login");
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    render() {
        const { username, password } = this.state;

        return (
            <div className={Css.body}>
                <Toaster richColors />
                <div className={Css.wrapDiv}>
                    <div className={Css.header}>Sign In</div>
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
                        enterEvent={this.signIn}
                    />

                    <Gap />

                    <Button onclickEvent={this.signIn} text={"Sign In"} />
                    <NotMemberLink />
                </div>
            </div>
        );
    }
}

export default LoginForm;
