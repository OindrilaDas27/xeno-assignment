import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../Login/Login.module.css';
import React from "react";

const Login = () => {
    const [username, setUsername] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    // const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.login_box}>
                <div className={styles.login_text}>
                    Login
                </div>
                <form className={styles.form_container}>
                    <input type="text" placeholder="username" name="username" value={username ? username : ""} className={styles.input_field} />
                    <input type="password" placeholder="Password" name="password" value={password ? password : ""} className={styles.input_field}  />
                    <div className={styles.btn_container}>
                        <button type="submit" className={styles.signin_button} >Login</button>
                    </div>
                </form>
                <div className={styles.signup_redirect_wrapper}>
                    Don't have an account? <Link to="/signup" className={styles.link}>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;