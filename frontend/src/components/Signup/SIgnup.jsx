import { useState } from "react";
import styles from "./Signup.module.css"
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setusername] = useState()
    const [password, setPassword] = useState()


    const navigate = useNavigate()

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_box}>
                <div className={styles.signup_text}>
                    Sign Up
                </div>
                <form>
                    <input type="username" placeholder="Username" name="username" value={username ? username : ""} className={styles.input_field} onChange={(e) => setusername(e.target.value)} required />
                    <input type="password" placeholder="Password" name="password" value={password ? password : ""} className={styles.input_field} onChange={(e) => setPassword(e.target.value)} required />
                    <div className={styles.btn_container}>
                        <button type="submit" className={styles.signup_button}>Sign Up</button>
                    </div>
                </form>
                <div className={styles.signin_redirect_wrapper}>
                    Already have an account? <Link to="/login" className={styles.link}>Login</Link>
                </div>
            </div>
        </div>
    )
};

export default Signup;