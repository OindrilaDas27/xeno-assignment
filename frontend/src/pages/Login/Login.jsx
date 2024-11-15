import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { LOGIN_ENDPOINT } from "../../utils/endpoints";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        try {
            const response = await axios.post(LOGIN_ENDPOINT, { idToken });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userName', user.name);
            console.log(token);

            alert(`Welcome, ${user.name}`);

            navigate('/feed');
        } catch (error) {
            console.error('Login failed', error);
            alert('Google login failed. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.login_box}>
                <div className={styles.login_text}>
                    Log In
                </div>
                <div className={styles.signup_redirect_wrapper}>
                    Sign In with Google 
                    <div style={{ marginTop: '1rem'}}></div>
                    <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log('Login Failed')}
                />
                </div>
            </div>
        </div>
    );
}

export default Login;
