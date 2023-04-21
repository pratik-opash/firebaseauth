import { React, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogedIn , setIsLogedIn] = useState(false);

  //   console.log(auth?.currentUser?.email);

  const handleClick = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    setIsLogedIn(true)
  };

  const googleSignIn = async () => {
    // console.log(signInWithPopup(auth, googleProvider));
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLogedIn(true)
    } catch (err) {
      console.error(err);
    }
  };
  const logout = async () => {
    await signOut(auth);
    setIsLogedIn(false)
  };

  return (
    <>
    {isLogedIn ? (
      
      <Button onClick={logout} variant="contained">
          LogOut
        </Button>
    ) : (
      <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-password-input"
          label="Email"
          type="email"
          autoComplete="current-password"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Stack direction="row" spacing={2} style={{ justifyContent: "center" }}>
        <Button onClick={handleClick} variant="contained">
          Submit
        </Button>
        <Button onClick={googleSignIn} variant="contained">
          Sign In With Google
        </Button>
        
      </Stack></>
    )}
      
    </>
  );
}
