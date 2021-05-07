import React, { useContext, useState } from 'react';
import styles from '../../../styles/Auth.module.css';
import { TextField, Button, Typography, CircularProgress } from "@material-ui/core";
import { AuthContext } from "../../providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/router";

function Auth() {
    const [state, setState] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        isLogin: true
    });
    const { login, register, loading } = useContext(AuthContext);
    const router = useRouter();

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleChangeAction = () => {
        setState(prevState => ({
            ...state,
            isLogin: !prevState.isLogin
        }))
    }

    const handleAction = () => {
        if (state.isLogin) {
            login(state.username, state.password, router)
        } else {
            const data = {
                username: state.username,
                email: state.email,
                password: state.password
            }
            register(data, router)
        }
    }

    return(
        <div className={styles.root}>
            <img
                className={styles.imagebanner}
                alt="camera taking a picture"
                src="https://i.pinimg.com/originals/e0/24/01/e024012e0f884a3d87d52da27d703ae1.gif"
            />
            <div className={styles.inputMain}>
                <Typography variant="h6" component="p">
                    {state.isLogin ? "Login" : "Create Account"}
                </Typography>
                <TextField
                    name="username"
                    margin="dense"
                    label="Username"
                    value={state.username}
                    required
                    fullWidth
                    onChange={handleChange}
                />
                {!state.isLogin &&
                    <TextField
                        name="email"
                        margin="dense"
                        label="Email"
                        value={state.email}
                        required
                        fullWidth
                        type="email"
                        onChange={handleChange}
                    />
                }
                <TextField
                    name="password"
                    margin="dense"
                    label="Password"
                    value={state.password}
                    required
                    type="password"
                    fullWidth
                    onChange={handleChange}
                />
                {!state.isLogin &&
                    <TextField
                        name="password2"
                        margin="dense"
                        label="Confirm Password"
                        value={state.password2}
                        required
                        type="password"
                        fullWidth
                        onChange={handleChange}
                    />
                }
                <div className={styles.authactions}>
                    <div className={styles.buttonwrapper}>
                        <Button
                            onClick={handleAction}
                            variant="outlined"
                            color="primary"
                            disabled={
                                (!state.isLogin && !state.email && !state.password2 || !state.isLogin && state.password2 !== state.password)
                                ||
                                (state.isLogin && !state.username && !state.password)
                            }
                        >
                            {state.isLogin ? "Login" : "Register"}
                        </Button>
                        {loading && <CircularProgress size={24} className={styles.buttonProgress} />}
                    </div>
                    <p onClick={handleChangeAction} className={styles.changeaction}>{state.isLogin ? "Register" : "Login"} instead</p>
                </div>
                <Link href="/">
                    <Typography variant="body2" className={styles.home}>
                        Take me home
                    </Typography>
                </Link>
            </div>
        </div>
    )
}

export default Auth;