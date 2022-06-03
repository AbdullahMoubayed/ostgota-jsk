import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  getDoc,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytes } from 'firebase/storage';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAhnblWamxpamxCh2HRz_13eyolWkYZOq4',
  authDomain: 'ostgotajaktskytteklubb.firebaseapp.com',
  projectId: 'ostgotajaktskytteklubb',
  storageBucket: 'ostgotajaktskytteklubb.appspot.com',
  messagingSenderId: '1092399648041',
  appId: '1:1092399648041:web:8cb38c3b4bed8d47b7bb38',
  measurementId: 'G-VBV6G61MC9',
};

// Initialize Firebase
initializeApp(firebaseConfig);

// intit services
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

// colloection ref
const colRef = collection(db, 'news');

// real time collection data
const q = query(colRef, orderBy('createdAt'));

let eventContainer = document.querySelector('.events-container');
if (window.location.pathname === '/') {
  onSnapshot(q, (snapshot) => {
    let news = [];
    snapshot.docs.forEach((doc) => {
      news.push({ ...doc.data(), id: doc.id });
    });

    news.forEach((item) => {
      eventContainer.innerHTML += `
      <div class="events-item">
        <a href='/update.html?id=${item.id}'>
        <p class="history">igår</p>
        <h4>${item.title}</h4>
        <p class="summary">${item.summary}</p>
        </a>
      </div>
      `;
    });
  });
}

let addForm = document.querySelector('.add-form');
let bildForm = document.querySelector('.bild-form');
let fileToUpload = document.querySelector('#file-to-upload');
let loader = document.querySelector('#loader');

// limit access to login.html & add.html to only logged in users
window.addEventListener('load', (e) => {
  if (window.location.pathname === '/controlpanel.html') {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if (addForm) {
          if (user) {
            //blank if correct login
            addForm.addEventListener('submit', (e) => {
              e.preventDefault();

              addDoc(colRef, {
                title: addForm.title.value,
                summary: addForm.summary.value,
                createdAt: serverTimestamp(),
              }).then(() => {
                addForm.reset();
              });
            });
          } else {
            window.location.href = 'index.html';
          }
        }

        if (fileToUpload) {
          fileToUpload.addEventListener('change', (e) => {
            e.preventDefault();
            // save file to variable
            let file = e.target.files[0];
            let name = file.name;
            let type = file.type;

            bildForm.addEventListener('submit', (e) => {
              e.preventDefault();
              // if file is image
              if (type.startsWith('image')) {
                // upload file
                let imagesRef = ref(storage, `images/${name}`);

                uploadBytes(imagesRef, file).then((snapshot) => {
                  console.log('Uploaded a blob or file!');
                });

                console.log(name, file);
              }
            });
          });
        }
      } else {
        // User is signed out
        window.location.href = '/login.html';
      }
    });
  }

  if (window.location.pathname === '/login.html') {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        window.location.href = '/controlpanel.html';
      }
    });
  }
});

const signUpForm = document.querySelector('#sign-up-form');
const loginForm = document.querySelector('#login-form');
const logout = document.querySelector('#logout');

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      signUpForm.email.value,
      signUpForm.password.value
    )
      .then((crede) => {
        console.log(crede.user);
        signUpForm.reset();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

if (logout) {
  logout.addEventListener('click', (e) => {
    auth
      .signOut(auth)
      .then(() => {
        console.log('logged out');
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      loginForm.email.value,
      loginForm.password.value
    )
      .then((crede) => {
        window.location.href = '/controlpanel.html';
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

const id = new URLSearchParams(window.location.search).get('id');

if (window.location.pathname === '/update.html') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const updateForm = document.querySelector('#update-form');
      let title = document.querySelector('#title');
      let summary = document.querySelector('#summary');
      const deleteBtn = document.querySelector('#delete-btn');

      let docRef = doc(db, 'news', id);

      getDoc(docRef).then((doc) => {
        title.value = doc.data().title;
        summary.value = doc.data().summary;
      });

      updateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        updateDoc(docRef, {
          title: addForm.title.value,
          summary: addForm.summary.value,
        }).then(() => {
          updateForm.reset();
          window.location.href = '/';
        });
      });

      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();

        deleteDoc(docRef)
          .then(() => {
            updateForm.reset();
            window.location.href = '/';
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      // User is signed out
      window.location.href = '/login.html';
    }
  });
}
