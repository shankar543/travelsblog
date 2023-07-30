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
  const storage = app.storage().ref();
  
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
          const imageRef = storage.child(imageName);
  
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
  function displayProfiles() {
    const profilesContainer = document.getElementById('profilesContainer');
  
    db.collection('profiles')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const profile = doc.data();
  
          // Create an HTML element for each profile
          const profileElement = document.createElement('div');
          profileElement.innerHTML = `
            <p>Name: ${profile.name}</p>
            <p>Age: ${profile.age}</p>
            <p>Place of Pic: ${profile.placeOfPic}</p>
            <img src="${profile.picUrl}" alt="Profile Image" width="200">
          `;
  
          profilesContainer.appendChild(profileElement);
        });
      })
      .catch((error) => {
        console.error('Error getting profiles: ', error);
      });
  }
  
  // Call displayProfiles() when the page is loaded or refreshed
  window.addEventListener('load', displayProfiles);
  
  // Example usage: call captureImage() when a button is clicked
  document.getElementById('captureButton').addEventListener('click', captureImage);
  