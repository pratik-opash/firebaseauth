import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { db , storage } from "./config/firebase";
import {
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Ref, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  Stack,
  TextField,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./config/firebase";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogedIn, setIsLogedIn] = useState(false);
  const movieCollectionRef = collection(db, "movies");

  const [newMovieTitle, setMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const [fileUpload, setFileUpload] = useState(null);

  const [updateTitle, setUpdateTitle] = useState();

  const [movieList, setMovieList] = useState([]);

  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMovieList(filteredData);
      console.log("filteredData", filteredData);
    } catch (err) {
      console.log("err", err);
    }
  };
  useEffect(() => {
    getMovieList();
  }, []);

  const handleClick = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    setIsLogedIn(true);
  };

  const googleSignIn = async () => {
    // console.log(signInWithPopup(auth, googleProvider));
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLogedIn(true);
    } catch (err) {
      console.error(err);
    }
  };
  const logout = async () => {
    await signOut(auth);
    setIsLogedIn(false);
  };

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releasDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
    } catch (err) {
      console.log(err);
    }
    getMovieList();
  };

  const deleteData = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateData = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updateTitle });
    getMovieList();
  };

  const uploadFile = async () => {
    if (fileUpload === null) return;
    console.log("fileUpload" , fileUpload[0].name);
    const filesFolderRef = ref(storage, `images/${fileUpload[0].name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        {isLogedIn ? (
          <>
            <Button
              style={{ marginTop: "20px" }}
              onClick={logout}
              variant="contained"
            >
              LogOut
            </Button>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                value={newMovieTitle}
                type="text"
                id="outlined-basic"
                label="Movie Title"
                variant="outlined"
                onChange={(e) => setMovieTitle(e.target.value)}
              />
              <TextField
                value={newReleaseDate}
                type="number"
                id="outlined-basic"
                label="Release Date..."
                variant="outlined"
                onChange={(e) => setNewReleaseDate(Number(e.target.value))}
              />

              <FormControlLabel
                value="male"
                control={<Radio />}
                label="Received An Oscar"
                // checked={isNewMovieOscar ? true : false}
                onChange={(e) => setIsNewMovieOscar(e.target.checked)}
              />
            </Box>
            <Button
              onClick={onSubmitMovie}
              style={{ marginTop: "20px" }}
              variant="contained"
            >
              Submit Movie
            </Button>
            {movieList.map((movie) => (
              <>
                <div>
                  <h1
                    style={{ color: movie.receivedAnOscar ? "green" : "black" }}
                  >
                    {movie.title}
                  </h1>
                  <p>Date : {movie.releasDate}</p>
                  <Stack
                    direction="row"
                    spacing={2}
                    style={{ justifyContent: "center" }}
                  >
                    <Button
                      onClick={() => deleteData(movie.id)}
                      // style={{ marginTop: "20px" }}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                    >
                      Delete Data
                    </Button>
                    <TextField
                      type="text"
                      label="Update Title...."
                      variant="standard"
                      onChange={(e) => setUpdateTitle(e.target.value)}
                    />
                    <Button
                      value={updateTitle}
                      onClick={() => updateData(movie.id)}
                      // style={{ marginTop: "20px" }}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                    >
                      Update Data
                    </Button>
                  </Stack>
                </div>
              </>
            ))}
            <Button
              variant="contained"
              component="label"
              style={{ marginTop: "20px" }}
              onClick={uploadFile}
            >
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={(e) => setFileUpload(e.target.files)}
              />
              Upload
            </Button>
            {/* <input type="file" onChange={(e) => setFileUpload(e.target.files)}/>
            <button  onClick={uploadFile}>Sub</button> */}
          </>
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
            <Stack
              direction="row"
              spacing={2}
              style={{ justifyContent: "center" }}
            >
              <Button onClick={handleClick} variant="contained">
                Submit
              </Button>
              <Button onClick={googleSignIn} variant="contained">
                Sign In With Google
              </Button>
            </Stack>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
