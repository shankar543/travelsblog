  
  
  // Variables for video stream and captured image
    let videoStream = null;
    let capturedImage = null;
    let is_Video_On = false;
 
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
    const startButton = document.getElementById('startButton');
    // const captureButton = document.getElementById('captureButton');
    const profilesContainer = document.getElementById('profilesContainer');
    const scrollToTopButton = document.getElementById('scrollToTopButton');
const stopButton = document.getElementById("stopButton")

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

  



// Capture image from camera
  function captureImage() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById('camera');
        video.srcObject = stream;
        video.play();
  
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        video.addEventListener('loadedmetadata', () => {
          // Set the canvas dimensions to match the video feed
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
  
          // Draw the video frame onto the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
          // Convert the canvas data to base64
          const imageData = canvas.toDataURL('image/jpeg');
  
          // Save the image to Firebase Storage
          const imageName = 'profile_image.jpg';
          const imageRef = storage.ref().child(imageName);
  
          imageRef.putString(imageData, 'data_url')
            .then(() => {
              // Get the download URL of the saved image
              imageRef.getDownloadURL()
                .then((imageUrl) => {
                  // Save the profile data to Firestore
                  const profileData = {
                    name: 'John Doe',
                    age: 25,
                    placeOfPic: 'New York',
                    picUrl: imageUrl
                  };
  
                  // Add the profile data to Firestore
                  db.collection('profiles')
                    .add(profileData)
                    .then((docRef) => {
                      console.log('Profile saved with ID: ', docRef.id);
                      displayProfiles();
                    })
                    .catch((error) => {
                      console.error('Error adding profile: ', error);
                    });
                })
                .catch((error) => {
                  console.error('Error getting download URL: ', error);
                });
            })
            .catch((error) => {
              console.error('Error saving image: ', error);
            });
        });
      })
      .catch((error) => {
        console.error('Error accessing camera: ', error);
      });
  }
  
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
// startButton.addEventListener('click', e => {
//   startVideoStream('user')
// });
startButton.onclick = function (e) {
  startVideoStream('user')
}

 

    // stop video stream if exists and remove stream
    function stopVideoStream() {
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
      const videoConstraints = {
        video: {
          facingMode: cameraPosition
        }
      };

      // Request access to the webcam
      navigator.mediaDevices.getUserMedia(videoConstraints)
        .then(stream => {
          is_Video_On = true;
          let captureButton = document.createElement("button");
          captureButton.textContent = "Capture Image"
          captureButton.setAttribute("id", "captureButton");
          captureButton.addEventListener("click", captureImage);
          captureButton.classList.add("capture-button");
          let actionbuttons = document.getElementsByClassName("actionbuttons")[0];
          actionbuttons.prepend(captureButton);
          videoStream = stream;
          const streamcontainer = document.createElement('div');
          streamcontainer.classList.add('streamcontainer');
          const streamCameraButtonContainer = document.createElement('div');
          streamCameraButtonContainer.classList.add('streamcameraactionbuttons')
          const selfieElm = document.createElement('span');
          selfieElm.innerText = 'selfie'
          selfieElm.addEventListener('click', e => {
            stopVideoStream();
            startVideoStream('user')
          })
          const backcamElm = document.createElement('span');
          backcamElm.innerText = 'back camera';
          backcamElm.addEventListener('click', e => {
            stopVideoStream();
            startVideoStream('environment')
          })
          streamCameraButtonContainer.appendChild(selfieElm);
          streamCameraButtonContainer.appendChild(backcamElm);
          const cameraElement = document.createElement('video');
          cameraElement.id = 'camera';
          cameraElement.width = '100%';
          cameraElement.height = 'auto';
          cameraElement.autoplay = true;
          cameraElement.playsinline = true;
          cameraElement.style.display = 'block';
          streamcontainer.prepend(cameraElement);
          streamcontainer.appendChild(streamCameraButtonContainer);

          document.body.prepend(streamcontainer);
          cameraElement.srcObject = stream;
        })
        .catch(error => {
          console.error('Error accessing the webcam:', error);
        });
    }

    // Example usage:
    // To access the front camera:
    // startVideoStream('user');

    // To access the back camera:
    // startVideoStream('environment');


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

    // Function to capture image from the video stream
    function captureImage() {
      // Create a canvas element and set its dimensions
      if (!is_Video_On) {
        startVideoStream('user')
      }
      const canvas = document.createElement('canvas');
      const videoElement = document.getElementById('camera');
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Draw the current frame from the video onto the canvas
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

      // Convert canvas data to base64-encoded JPEG image
      const imageDataURL = canvas.toDataURL('image/jpeg');

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
          //   Create profile data object
          const profileData = {
            locationname: 'John Doe',
            locationstory: 'every picture has its story',
            placeOfPic: null,
            picUrl: downloadURL,
            position: null
          };
          getdataFromLayout(profileData);
        })
        .catch(error => {
          console.error('Error saving the profile:', error);
        });
    }

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
       
        <label for="locationname">Snap is About:</label>
        <input type = "text" id="locationname">   
       
       
        <label for="locationstory">SnapDescription:</label>
        <input type = "textarea" id="locationstory">   
       
        <button id="save">save</button>
          <span id="micbtn" class="material-symbols-outlined">mic_off</span>`;
      const locationname = formcontainer.querySelector('#locationname');
      const locationstory = formcontainer.querySelector('#locationstory');
      const micbtn = formcontainer.querySelector('#micbtn');
      

      getNarrationStory(micbtn, locationstory);
    
      const savebtn = formcontainer.querySelector('#save');
      savebtn.addEventListener('click', e => {

        if (locationname?.value && locationstory?.value) {
          profileData.locationname = locationname.value;
          profileData.locationstory = locationstory.value;
          layer.remove();
          document.body.classList.remove('removescroll')
          saveWithPosition(profileData)
            .then(docRef => {
              console.log('Profile saved with ID:' + docRef);
              removeLoader();
              alert('image saved');
            }).catch(err => {
              console.log("some error" + err);
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
              <span class="remove">remove</span>
              <img src="${profile.picUrl}" alt="Profile Image">
              <h3>${profile.locationname}</h3>
              <p> <strong>story:</strong> ${profile.locationstory}</p>
              <p> <strong>Place of Pic:</strong> ${profile.locationname}</p>
              <section>
              <h4>position</h4>
              <p><strong>lat:</strong>${profile?.position?.latitude} <strong>long:</strong>${profile?.position?.longitude}<p>
              <p><strong>locationName:</strong>${(profile?.position?.locationName)?profile?.position?.locationName:"failed to find LocationName"}</p>
              </section></div>
            `;
            profileElement.querySelector(".remove")
              .addEventListener("click", (e) => {
                if (!confirm('are you sure , u want to delete?')) { return }
                e.target.setAttribute("pointer-events", "none")
                const docid = e.target.parentElement.getAttribute("id");
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