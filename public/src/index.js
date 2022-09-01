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

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

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
const colRef2 = collection(db, 'tavling');

// Srorage ref
let storageRef = ref(storage);

// real time collection data
const q = query(colRef, orderBy('createdAt'));
const q2 = query(colRef2, orderBy('createdAt'));

let eventContainer = document.querySelector('.events-container');

let imagesArry = [];

if (eventContainer) {
  onSnapshot(q, (snapshot) => {
    let news = [];
    snapshot.docs.forEach((doc) => {
      news.push({ ...doc.data(), id: doc.id });
    });

    news.forEach((item) => {
      eventContainer.innerHTML += `
      <div class="events-item">
        <a href='/update.html?id=${item.id}'>
        <p class="history">${item.createdAt.toDate().toDateString()}</p>
        <h4>${item.title}</h4>
        <p class="summary">${item.summary}</p>
        </a>
      </div>
      `;
    });
  });
}

let tavlingContainer = document.querySelector('.results');
if (tavlingContainer) {
  onSnapshot(q2, (snapshot) => {
    let tavlingar = [];
    snapshot.docs.forEach((doc) => {
      tavlingar.push({ ...doc.data(), id: doc.id });
    });

    tavlingContainer.innerHTML = `
    <h2>Tävlingsresultat</h2>
    <div class='tavlingar-cont'>
      <span>
      <h3>${tavlingar[0].title}</h3>
      <span class="info">
        <p>${tavlingar[0].createdAt.toDate().toDateString()}</p>
        <p>${tavlingar[0].location}</p>
      </span>

      <div class="results-container">
        <div class="result">
          <h4>Junior</h4>
          <span>
            <p>1. ${tavlingar[0].junior.first}</p>
            <p>2. ${tavlingar[0].junior.second}</p>
            <p>3. ${tavlingar[0].junior.third}</p>
          </span>
        </div>

        <div class="result">
          <h4>Junior</h4>
          <span>
            <p>1. ${tavlingar[0].lady.first}</p>
            <p>2. ${tavlingar[0].lady.second}</p>
            <p>3. ${tavlingar[0].lady.third}</p>
          </span>
        </div>
      </div>

      <div class="summary">${tavlingar[0].disc}</div>
      </span>

      <span class='tavling-imgs'>
        <img src="${tavlingar[0].imgs[0].url}" alt="">
        <img src="${tavlingar[0].imgs[1].url}" alt="">
        <img src="${tavlingar[0].imgs[2].url}" alt="">
      </span>
      </div>
      
    `;
  });
}

let tavlingarna = document.querySelector('#tavlingarna');

if (tavlingarna) {
  onSnapshot(q2, (snapshot) => {
    let tavlingars = [];
    snapshot.docs.forEach((doc) => {
      tavlingars.push({ ...doc.data(), id: doc.id });
    });

    tavlingars.forEach((item) => {
      tavlingarna.innerHTML += `
    <div class="tavlingarna-item"><a href='/updatetavling.html?id=${item.id}'>
    <div>
    <h2>Tävlingsresultat</h2>
      <h3>${item.title}</h3>
      <span class="info">
        <p>${item.createdAt.toDate().toDateString()}</p>
        <p>${item.location}</p>
      </span>

      <div class="results-container">
        <div class="result">
          <h4>Junior</h4>
          <span>
            <p>1. ${item.junior.first}</p>
            <p>2. ${item.junior.second}</p>
            <p>3. ${item.junior.third}</p>
          </span>
        </div>

        <div class="result">
          <h4>Junior</h4>
          <span>
            <p>1. ${item.lady.first}</p>
            <p>2. ${item.lady.second}</p>
            <p>3. ${item.lady.third}</p>
          </span>
        </div>
      </div>

      <div class="summary">${item.disc}</div>
    </div>
    

    </a></div>
    `;
    });
  });
}

let addForm = document.querySelector('.add-form');
let tavlinForm = document.querySelector('#tavling');
let bildForm = document.querySelector('.bild-form');
let fileToUpload = document.querySelector('#file-to-upload');

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

        if (tavlinForm) {
          if (user) {
            //blank if correct login
            tavlinForm.addEventListener('submit', (e) => {
              e.preventDefault();

              const filesLit = document.querySelector('#image').files;

              const files = Array.from(filesLit);
              var itemsProcessed = 0;

              files.forEach((file, index, array) => {
                let imageRef = ref(storage, 'images/' + file.name);
                let imgRef = 'images/' + file.name;
                const metadata = file.type.split('/')[0];
                const uploadTask = uploadBytesResumable(
                  imageRef,
                  file,
                  metadata
                );

                if (metadata === 'image') {
                  uploadBytes(imageRef, file).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    getDownloadURL(imageRef).then((url) => {
                      let data = {
                        url,
                        imgRef,
                      };
                      imagesArry.push(data);
                      console.log('imagesArry');
                      itemsProcessed++;
                      if (itemsProcessed === array.length) {
                        addDoc(colRef2, {
                          title: tavlinForm.title.value,
                          location: tavlinForm.location.value,
                          disc: tavlinForm.disc.value,
                          junior: {
                            first: tavlinForm.junior_f.value,
                            second: tavlinForm.junior_s.value,
                            third: tavlinForm.junior_t.value,
                          },
                          lady: {
                            first: tavlinForm.lady_f.value,
                            second: tavlinForm.lady_s.value,
                            third: tavlinForm.lady_t.value,
                          },
                          imgs: imagesArry,
                          createdAt: serverTimestamp(),
                        }).then(() => {
                          console.log('done');
                          tavlinForm.reset();
                        });
                      }
                    });
                  });
                }
              });
            });
          } else {
            window.location.href = 'index.html';
          }
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

const id2 = new URLSearchParams(window.location.search).get('id');

if (window.location.pathname === '/updatetavling.html') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const updateFormt = document.querySelector('#updatera-form');
      const deleteBtn = document.querySelector('#delet-btn');

      let docRef3 = doc(db, 'tavling', id2);

      getDoc(docRef3).then((doc) => {
        updateFormt.title.value = doc.data().title;
        updateFormt.location.value = doc.data().location;
        updateFormt.disc.value = doc.data().disc;
        updateFormt.junior_f.value = doc.data().junior.first;
        updateFormt.junior_s.value = doc.data().junior.second;
        updateFormt.junior_t.value = doc.data().junior.third;
        updateFormt.lady_f.value = doc.data().lady.first;
        updateFormt.lady_s.value = doc.data().lady.second;
        updateFormt.lady_t.value = doc.data().lady.third;
      });

      updateFormt.addEventListener('submit', (e) => {
        e.preventDefault();

        updateDoc(docRef3, {
          title: updateFormt.title.value,
          location: updateFormt.location.value,
          disc: updateFormt.disc.value,
          junior: {
            first: updateFormt.junior_f.value,
            second: updateFormt.junior_s.value,
            third: updateFormt.junior_t.value,
          },
          lady: {
            first: updateFormt.lady_f.value,
            second: updateFormt.lady_s.value,
            third: updateFormt.lady_t.value,
          },
        }).then(() => {
          updateFormt.reset();
          window.location.href = '/';
        });
      });

      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();

        deleteDoc(docRef3)
          .then(() => {
            updateFormt.reset();
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

console.log('arr' + imageArray);
