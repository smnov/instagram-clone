import './App.css';
import React, { useState, useEffect } from 'react';
import Post from './components/Post';

const BASE_URL = 'http://localhost:8000/'

function App() {

  const [posts, setPosts] = useState([]);

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
        setPosts(data)
      })
      .catch(error => {
        console.log(error)
        alert(error)
      })
    }, [])

  return (
    <div className="app_posts">
      {
        posts.map(post => (
          <Post post={post}/>)
      )} 
    </div>
  );
}

export default App;
