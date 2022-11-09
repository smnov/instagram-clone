import './App.css';
import React, { useState, useEffect } from 'react';
import Post from './components/Post';
import { Button, Modal, Input, Box } from "@mui/material" 
import { createTheme } from "@mui/system";

const BASE_URL = 'http://localhost:8000/'

function getModalStyle() {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}




function App() {


  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then(response => {
        const json = response.json()
        console.log(json)
        if (response.ok) {
          return json
        }
        throw response
  })
      .then(data => {
        const result = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(Date.UTC(t_a[0], t_a[1]-1, t_a[2], t_a[3], t_a[4], t_a[5]));
          const d_b = new Date(Date.UTC(t_b[0], t_b[1]-1, t_a[2], t_a[3], t_a[4], t_a[5]));
          return d_b - d_a
        })
        return result
      })
      .then(data => {
        setPosts(data)
        setAuthToken(data.acess_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.log(error)
        alert(error)
      })
    }, [])

  const signIn = (event) => {
    event.preventDefault();

    let formData = new FormData()
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })
    setOpenSignIn(false);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

  return (
    <div className="app">    

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <form className="app_signin">
            <center>
              <img className="app_headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
                  alt="Instagram" />
            </center>
              <Input placeholder="username"
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)} />
              <Input
                     placeholder="password"
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)} /> 
              <Button type="submit"
                      onClick={signIn}>Login</Button>
          </form>
        </Box>

    </Modal>
    <div className="app_header">
        <img className="app_headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
            alt="Instagram" />
           <div>
        <Button onClick={() => setOpenSignIn(true)}>Login</Button>
        <Button onClick={() => setOpenSignUp(true)}>Signup</Button>

       </div>
    </div>
      <div className="app_posts">
      {
        posts.map(post => (
          <Post post={post} key={post.id}/>)
      )} 
    </div>
    </div>

  );
}

export default App;
