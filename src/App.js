import { useState, useEffect } from 'react';

import './App.css';
import Post from './Components/Post';
import ImageUpload from './Components/ImageUpload';
import { db, auth } from './firebase/firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@mui/material/Modal';
import { Button, Input } from '@mui/material';

function getModalStyle() {
   const top = 50;
   const left = 50;

   return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
   };
}

const useStyles = makeStyles((theme) => ({
   paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
   },
}));

function App() {
   const classes = useStyles();
   const [modalStyle] = useState(getModalStyle);

   const [posts, setPosts] = useState([]);
   const [open, setOpen] = useState(false);
   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [user, setUser] = useState(null);
   const [openSignIn, setOpenSignIn] = useState(false);

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
         if (authUser) {
            //user has logged in
            console.log(authUser);
            setUser(authUser);
         } else {
            //user has logged out
            setUser(null);
         }
      });

      return () => {
         unsubscribe();
      };
   }, [user]);

   useEffect(() => {
      db.collection('posts')
         .orderBy('timestamp', 'desc')
         .onSnapshot((snapshot) => {
            setPosts(
               snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
            );
         });
   }, []);

   const signUp = (event) => {
      event.preventDefault();

      auth
         .createUserWithEmailAndPassword(email, password)
         .then((authUser) => {
            return authUser.user.updateProfile({
               displayName: username,
            });
         })
         .catch((error) => alert(error.message));

      setOpen(false);
   };

   const signIn = (event) => {
      event.preventDefault();

      auth
         .signInWithEmailAndPassword(email, password)
         .catch((error) => alert(error.message));

      setOpenSignIn(false);
   };

   return (
      <div className='app'>
         <Modal open={open} onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
               <form className='app__signUp'>
                  <center>
                     <img
                        className='app__headerImage'
                        src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                        alt='instagram'
                     />
                  </center>
                  <Input
                     type='text'
                     placeholder='username'
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                     type='email'
                     placeholder='email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                     type='password'
                     placeholder='password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type='submit' onClick={signUp}>
                     Sign Up
                  </Button>
               </form>
            </div>
         </Modal>

         <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
            <div style={modalStyle} className={classes.paper}>
               <form className='app__signUp'>
                  <center>
                     <img
                        className='app__headerImage'
                        src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                        alt='instagram'
                     />
                  </center>
                  <Input
                     type='email'
                     placeholder='email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                     type='password'
                     placeholder='password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type='submit' onClick={signIn}>
                     Sign In
                  </Button>
               </form>
            </div>
         </Modal>

         <div className='app__header'>
            <img
               className='app__headerImage'
               src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
               alt='instagram'
            />
            {user ? (
               <Button onClick={() => auth.signOut()}>Log Out</Button>
            ) : (
               <div className='app__loginContainer'>
                  <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                  <Button onClick={() => setOpen(true)}>Sign Up</Button>
               </div>
            )}
         </div>

         <div className='app__posts'>
            <div className='app_postsCenter'>
               {posts.map(({ id, post }) => (
                  <Post
                     key={id}
                     postId={id}
                     user={user}
                     username={post.username}
                     caption={post.caption}
                     imageUrl={post.imageUrl}
                  />
               ))}
            </div>
         </div>

         {user?.displayName ? (
            <ImageUpload username={user.displayName}></ImageUpload>
         ) : (
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
               Sign In to Upload a Post!
            </h3>
         )}
      </div>
   );
}

export default App;
