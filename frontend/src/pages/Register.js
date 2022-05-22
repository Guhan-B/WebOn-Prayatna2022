import React from "react";
import { Link } from "react-router-dom";

import styles from "../styles/Authentication.module.css"
import BG from "../assets/BG.jpg"

const Register = () => {
  return (
    <div className={styles.container}>
        <div className={styles.form}>
            <form onSubmit={() => {}}>
                <h1>Register</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus facilisis luctus sapien</p>
                
                <div>
                    <label id="name">Name</label>
                    <input type="text" for="text"></input>
                </div>
                <div>
                    <label id="email">Email</label>
                    <input type="email" for="email"></input>
                </div>
                <div>
                    <label id="password">Password</label>
                    <input type="password" for="password"></input>
                </div>

                <button>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login Here</Link></p>
        </div>
        <div className={styles.image}>
            <img src={BG} alt=""/>
        </div>
    </div>
  )
}

export default Register