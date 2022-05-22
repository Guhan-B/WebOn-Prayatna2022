import React from "react";
import { Link } from "react-router-dom";

import styles from "../styles/Authentication.module.css"
import BG from "../assets/BG.jpg"

const Login = () => {
  return (
    <div className={styles.container}>
        <div className={styles.form}>
            <form onSubmit={() => {}}>
                <h1>Login</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus facilisis luctus sapien</p>
                <div>
                    <label id="email">Email</label>
                    <input type="email" for="email"></input>
                </div>
                <div>
                    <label id="password">Password</label>
                    <input type="password" for="password"></input>
                </div>
                <button>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register Here</Link></p>
        </div>
        <div className={styles.image}>
            <img src={BG} alt=""/>
        </div>
    </div>
  )
}

export default Login