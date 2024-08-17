

// Variables for video stream and captured image
let videoStream = null;
let capturedImage = null;
let is_Video_On = false;
let startCamaraBtn = document.getElementById("startButton");
const profilesContainer = document.getElementById('profilesContainer');
const scrollToTopButton = document.getElementById('scrollToTopButton');
const stopButton = document.getElementById("stopButton");
stopButton.classList.add("hide");
// Initialize Firebase
const app = firebase.initializeApp({
  apiKey: "AIzaSyCaQ_5iR5aPm6kBVwhR9Zqg7iQHYUUSh6g",
  authDomain: "myfavurls-6a643.firebaseapp.com",
  projectId: "myfavurls-6a643",
  storageBucket: "myfavurls-6a643.appspot.com",
  messagingSenderId: "312966781114",
  appId: "1:312966781114:web:9dc939a7364a6336014a83",
});

// Create a reference to the Firestore database
const db = app.firestore();

// Create a reference to the Firebase Storage bucket
const storage = app.storage();
const profilesCollection = db.collection('profiles');

// Reference to Firebase Storage
// const storage = app.storage();

// DOM elements

// const captureButton = document.getElementById('captureButton');


// Call displayProfiles() when the page is loaded or refreshed
window.addEventListener('load', displayProfiles);

// Example usage: call captureImage() when a button is clicked
document.getElementById('captureButton')?.addEventListener('click', captureImage);
// Adding removal of video stream
stopButton.addEventListener('click', stopVideoStream);

// Add event listener to capture image
// captureButton.addEventListener('click', captureImage);

// Add event listener to scroll to top
scrollToTopButton.addEventListener('click', scrollToTop);

// Capture image from camera disable below
// function captureImage() {

//   navigator.mediaDevices.getUserMedia({ video: true })
//     .then((stream) => {
//       const video = document.getElementById('camera');
//       video.srcObject = stream;
//       video.play();

//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');

//       video.addEventListener('loadedmetadata', () => {
//         // Set the canvas dimensions to match the video feed
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         // Draw the video frame onto the canvas
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Convert the canvas data to base64
//         const imageData = canvas.toDataURL('image/jpeg');

//         // Save the image to Firebase Storage
//         const imageName = 'profile_image.jpg';
//         const imageRef = storage.ref().child(imageName);

//         imageRef.putString(imageData, 'data_url')
//           .then(() => {
//             // Get the download URL of the saved image
//             imageRef.getDownloadURL()
//               .then((imageUrl) => {
//                 // Save the profile data to Firestore
//                 const profileData = {
//                   name: 'John Doe',
//                   age: 25,
//                   placeOfPic: 'New York',
//                   picUrl: imageUrl
//                 };

//                 // Add the profile data to Firestore
//                 db.collection('profiles')
//                   .add(profileData)
//                   .then((docRef) => {
//                     console.log('Profile saved with ID: ', docRef.id);
//                     displayProfiles();
//                   })
//                   .catch((error) => {
//                     console.error('Error adding profile: ', error);
//                   });
//               })
//               .catch((error) => {
//                 console.error('Error getting download URL: ', error);
//               });
//           })
//           .catch((error) => {
//             console.error('Error saving image: ', error);
//           });
//       });
//     })
//     .catch((error) => {
//       console.error('Error accessing camera: ', error);
//     });
// }

// Display profiles from Firestore
// function displayProfiles() {
//   const profilesContainer = document.getElementById('profilesContainer');
//   profilesContainer.innerHTML = "";
//   db.collection('profiles')
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const profile = doc.data();

//         // Create an HTML element for each profile
//         const profileElement = document.createElement('div');
//         profileElement.innerHTML = `
//           <p>Name: ${profile.name}</p>
//           <p>Age: ${profile.age}</p>
//           <p>Place of Pic: ${profile.placeOfPic}</p>
//           <img src="${profile.picUrl}" alt="Profile Image" width="200">
//         `;

//         profilesContainer.appendChild(profileElement);
//       });
//     })
//     .catch((error) => {
//       console.error('Error getting profiles: ', error);
//     });
// }




// Add event listener to start the video stream
// startCamaraBtn.addEventListener('click', e => {
//   startVideoStream('user')
// });
startCamaraBtn.onclick = function (e) {
  const layer = document.createElement('div');
  document.body.append(layer)
  layer.classList.add('blacksheet');
  document.body.classList.add("removescroll");
  startVideoStream('user');
  stopButton.classList.remove("hide");
}



// stop video stream if exists and remove stream
function stopVideoStream() {
  let layer = document.getElementsByClassName("blacksheet")[0]
  layer.remove();
  document.body.classList.remove('removescroll')
  startCamaraBtn.classList.remove("hide");
  startCamaraBtn.classList.add("enable");
  profilesContainer.classList.add("display-grid");
  stopButton.classList.add("hide")
  stopButton.classList.remove("enable")
  if (videoStream) {
    const video_elm = document.getElementById('camera');
    video_elm.srcObject = null;
    is_Video_On = false;
    let captureButton = document.getElementById("captureButton");
    captureButton?.remove();
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
    video_elm.parentElement.remove();
  }
}

// Function to start the video stream
function startVideoStream(cameraPosition) {
  startCamaraBtn.classList.remove("enable")
  startCamaraBtn.classList.add("hide");
  stopButton.classList.remove("hide");
  stopButton.classList.add("enable");
  profilesContainer.classList.add("hide");
  const videoConstraints = {
    video: {
      facingMode: cameraPosition
    }
  };

  // Request access to the webcam
  navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(stream => {
      is_Video_On = true;
      let captureButton = document.createElement("span");
      captureButton.innerHTML = `<i class="fa-solid fa-heart"></i>`
      captureButton.setAttribute("id", "captureButton");
      captureButton.classList.add('cam-controls')
      captureButton.addEventListener("click", captureImage);


      videoStream = stream;
      const streamcontainer = document.createElement('div');
      streamcontainer.classList.add('streamcontainer');
      const cam_controls = document.createElement('div');
      cam_controls.classList.add('cam-controls')
      const selfieElm = document.createElement('span');
      selfieElm.innerHTML = `<i class="fa-solid fa-image-portrait"></i>`
      selfieElm.addEventListener('click', e => {
        stopVideoStream();
        startVideoStream('user')
      })
      const backcamElm = document.createElement('span');
      backcamElm.innerHTML = `<i class="fa-solid fa-camera-rotate"></i>`
      backcamElm.addEventListener('click', e => {
        stopVideoStream();
        startVideoStream('environment')
      })
      cam_controls.appendChild(selfieElm);
      cam_controls.appendChild(captureButton);
      cam_controls.appendChild(backcamElm);
      const cameraElement = document.createElement('video');
      cameraElement.id = 'camera';
      cameraElement.autoplay = true;
      cameraElement.playsinline = true;
      cameraElement.classList.add("camera-element")
      streamcontainer.prepend(cameraElement);
      streamcontainer.appendChild(cam_controls);

      document.body.prepend(streamcontainer);
      cameraElement.srcObject = stream;
    })
    .catch(error => {
      console.error('Error accessing the webcam:', error);
    });
}




function fetchLocationFromLatAndLong(position) {
  initLoader();
  return new Promise((res, rej) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}`;
    // const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${position.latitude}+${position.longitude}&no_annotations=1`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const locationName = data.display_name || data.results?.[0]?.formatted;
        console.log('Location Name:', locationName);
        position.locationName = locationName;
        res(position);
      })
      .catch(error => {
        res(position);
        console.error('Error:', error);
      });
  })
}


//getting coordinates of images
function saveWithPosition(profileData) {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;

        profileData.position = {
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed
        };
        fetchLocationFromLatAndLong(profileData.position).then(data => {
          if (typeof data == "object") {
            profilesCollection.add(profileData)
              .then(docRef => {
                res(docRef.id);
              })
              .catch(err => {
                rej(err);
              })
          }
        }).catch(err => {
          rej(err);
        })

      },
      error => {
        console.error('Error getting user position:', error);

        // Save profile data to Firestore without position
        profilesCollection.add(profileData)
          .then(recId => {
            console.log('doc addeded with ' + recId)
          })
          .catch(err => {
            rej(err);
          })
      }
    );

  })
}

function captureImage() {
  scrollToTopButton.click();
  initLoader();

  if (!is_Video_On) {
    startVideoStream('user');
  }

  const videoElement = document.getElementById('camera');
  // videoElement.addEventListener('loadedmetadata', () => {
    // Create a canvas element and set its dimensions
    const canvas = document.createElement('canvas');
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // Draw the current frame from the video onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

    // Apply contrast and soft skin effect
    // applyEffects(context, canvas.width, canvas.height);

    // Convert canvas data to base64-encoded JPEG image with higher quality
    const imageDataURL = canvas.toDataURL('image/jpeg', 1.0);

    // Save the image to Firebase Storage
    const storageRef = storage.ref();
    const imageName = generateImageName();
    const imageRef = storageRef.child(`images/${imageName}`);
    imageRef.putString(imageDataURL, 'data_url')
      .then(() => {
        // Get the download URL of the saved image
        return imageRef.getDownloadURL();
      })
      .then(downloadURL => {
        // Create profile data object
        const profileData = {
          locationname: 'John Doe',
          locationstory: 'every picture has its story',
          placeOfPic: null,
          picUrl: downloadURL,
          position: null
        };
        removeLoader();
        getdataFromLayout(profileData);
      })
      .catch(error => {
        console.error('Error saving the profile:', error);
      });
  // }); // Ensure the event listener is only triggered once
}

function applyEffects(context, width, height) {
  // Apply contrast effect
  context.filter = 'contrast(1.2)'; // Increase contrast
  context.drawImage(context.canvas, 0, 0, width, height);


  // Apply a soft skin effect using a Gaussian blur
  // First, create a temporary canvas for the blur effect
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempContext = tempCanvas.getContext('2d');

  tempContext.drawImage(context.canvas, 0, 0, width, height);
  tempContext.filter = 'blur(3px)'; // Apply Gaussian blur for soft skin effect
  tempContext.drawImage(tempCanvas, 0, 0, width, height);

  // Draw the softened image back to the original canvas
  context.clearRect(0, 0, width, height);
  context.drawImage(tempCanvas, 0, 0, width, height);

  // Reset the filter to avoid affecting further drawing
  context.filter = 'none';
}


// Function to capture image from the video stream 
// function captureImage() {
//   scrollToTopButton.click();
//   initLoader();
//   // Create a canvas element and set its dimensions
//   if (!is_Video_On) {
//     startVideoStream('user')
//   }
//   const canvas = document.createElement('canvas');
//   const videoElement = document.getElementById('camera');
//   const videoWidth = videoElement.videoWidth;
//   const videoHeight = videoElement.videoHeight;
//   canvas.width = videoWidth;
//   canvas.height = videoHeight;

//   // Draw the current frame from the video onto the canvas
//   const context = canvas.getContext('2d');
//   context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

//   // Convert canvas data to base64-encoded JPEG image
//   const imageDataURL = canvas.toDataURL('image/jpeg');

//   // Save the image to Firebase Storage
//   const storageRef = storage.ref();
//   const imageName = generateImageName();
//   const imageRef = storageRef.child(`images/${imageName}`);
//   imageRef.putString(imageDataURL, 'data_url')
//     .then(() => {
//       // Get the download URL of the saved image
//       return imageRef.getDownloadURL();
//     })
//     .then(downloadURL => {
//       //   Create profile data object
//       const profileData = {
//         locationname: 'John Doe',
//         locationstory: 'every picture has its story',
//         placeOfPic: null,
//         picUrl: downloadURL,
//         position: null
//       };
//       removeLoader()
//       getdataFromLayout(profileData);
//     })
//     .catch(error => {
//       console.error('Error saving the profile:', error);
//     });
// }

// get story  from mic
function getNarrationStory(micbtn, locationstory) {

  // Speech recognition object
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  // Event listener to start voice recognition
  micbtn.addEventListener('click', (e) => {
    if (e.target.innerText == 'mic_off') {
      e.target.innerText = 'mic';
    } else {
      e.target.innerText = 'mic_off';
    }
    if (micbtn.innerText == 'mic') {
      recognition.start();
    } else {
      recognition.stop();
    }

  });

  // Event listener for speech recognition result
  recognition.addEventListener('result', event => {
    const speechResult = event.results[event.results.length - 1][0].transcript;
    locationstory.value += speechResult + ' ';
  });

  // Event listener for speech recognition error
  recognition.addEventListener('error', event => {
    console.error('Speech recognition error:', event.error);
  });

  // Event listener for speech recognition end
  recognition.addEventListener('end', () => {
    micbtn.disabled = false;
    recognition.stop();
  });
}

// add dark background and get description and name of the location
function getdataFromLayout(profileData) {
  const layer = document.createElement('div');
  layer.classList.add('blacklayer');
  document.body.classList.add("removescroll");
  const formcontainer = document.createElement('div');
  formcontainer.innerHTML = `
       
        <label for="locationname"> TAG:</label>
        <input type = "text" id="locationname">   
       
       
        <label for="locationstory">ABOUT:</label>
        <input type = "textarea" id="locationstory">   
       
        <button id="save">save</button>
        <span id="micbtn" class="material-symbols-outlined">mic_off</span>
        <button id="cancel">Cancel</button>
        `;
  const locationname = formcontainer.querySelector('#locationname');
  const locationstory = formcontainer.querySelector('#locationstory');
  const cancelbtn = formcontainer.querySelector('#cancel')
  const micbtn = formcontainer.querySelector('#micbtn');
  cancelbtn.addEventListener("click", (e) => {
    layer.remove();
    document.body.classList.remove('removescroll')
  })

  getNarrationStory(micbtn, locationstory);

  const savebtn = formcontainer.querySelector('#save');
  savebtn.addEventListener('click', e => {

    if (locationname?.value && locationstory?.value) {
      profileData.locationname = locationname.value;
      profileData.locationstory = locationstory.value;
      profileData.date = new Date().toDateString();
      scrollToTop();
      layer.remove();
      document.body.classList.remove('removescroll')
      saveWithPosition(profileData)
        .then(docRef => {
          console.log('Profile saved with ID:' + docRef);
          removeLoader()
          displayProfiles();
        }).catch(err => {

          console.log("some error" + err);
          removeLoader()
          alert("image save failed");
        })
    } else {

      alert('location name and location story should not be empty');
    }
  });
  layer.appendChild(formcontainer);
  document.body.append(layer);
}

// Function to generate a unique image name
function generateImageName() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `image_${timestamp}_${randomNum}.jpg`;
}

// Function to display profiles from Firestore
function displayProfiles() {
  profilesContainer.innerHTML = '';
  profilesCollection.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const profile = doc.data();
        const profileElement = document.createElement('div');
        profileElement.classList.add('profile');
        profileElement.innerHTML = `
              <div class="image-container" id=${doc.id}>
              <span class="download"><span class="material-symbols-outlined"> download image</span></span>
              <span class="remove"><span class="material-symbols-outlined">delete_forever</span></span>
              <img src="${profile.picUrl}" alt="Profile Image">
              <h3>${profile.locationname}</h3>
              <p> <strong>ABOUT:</strong> ${profile.locationstory} 😊</p>
              <p> <strong>#TAG:</strong> ${profile.locationname}</p>
              <section>
              <h4>${profile.date ? profile.date : new Date().toDateString()} ❤️</h4>
              
              <p><strong>LOCATION:</strong>${(profile?.position?.locationName) ? profile?.position?.locationName : "failed to find LocationName"}</p>
              </section></div>
            `;
        // <p><strong>lat:</strong>${profile?.position?.latitude} <strong>long:</strong>${profile?.position?.longitude}<p></p>
        profileElement.querySelector(".download").addEventListener("click", (e) => {
          let psw = prompt("plesae enter password")
          if (psw.toLowerCase() != "mouni") {
            alert("sorry,you are not authorised to download")
            return
          }
          console.log('downloading image')
          let link = document.createElement("a");
          link.href = profile.picUrl; // URL of the file to download
          link.download = profile.locationstory; // Suggested filename for the download
          document.body.appendChild(link); // Append the link to the body (not the document itself)
          link.click(); // Trigger the download
          document.body.removeChild(link); // Remove the link from the body

        })
        profileElement.querySelector(".remove")
          .addEventListener("click", (e) => {
            if (!confirm('are you sure , u want to delete?')) { return }
            else {
              let psw = prompt("plesae enter password")
              if (psw.toLowerCase() != "mouni") {
                alert("sorry,you are not authorised to delete")
                return
              }
            }
            e.target.setAttribute("pointer-events", "none")
            const docid = e.target.parentElement.parentElement.getAttribute('id');
            profileElement.querySelector('.image-container img').src = 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif';
            profilesCollection
              .doc(docid)
              .delete()
              .then(() => {
                console.log("1 document deleted");
                profileElement.remove();
              })
              .catch(e => {
                e.target.setAttribute("pointer-events", "auto")
                console.log("error in deleting" + e);
              });
          })
        profilesContainer.prepend(profileElement);
      });
    })
    .catch(error => {
      console.error('Error getting profiles:', error);
    });
}

// Function to scroll to the top of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initLoader() {
  console.log("loader started")
  const loader = document.createElement("div");
  loader.classList.add("blacklayer");
  let img = document.createElement("img");
  img.src = "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
  loader.appendChild(img);
  document.body.append(loader);
  document.body.classList.add("removescroll")
}
function removeLoader() {
  document.querySelector(".blacklayer").remove();
  document.body.classList.remove("removescroll")
}
// <p><strong>headding:</strong>${(profile?.position?.heading)?profile?.position?.heading:"headding towards unknown direction"}</p>

