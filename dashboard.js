document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
});

function initDashboardTabs() {
  const links = document.querySelectorAll('.dash-link:not(.external)');
  const panes = document.querySelectorAll('.tab-pane');

  // Check URL for tab param
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get('tab');

  if (requestedTab) {
    switchTab(requestedTab);
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-tab');
      switchTab(target);
      // Update URL without reload
      window.history.pushState({}, '', `?tab=${target}`);
    });
  });
}

function switchTab(tabId) {
  const links = document.querySelectorAll('.dash-link:not(.external)');
  const panes = document.querySelectorAll('.tab-pane');
  
  let found = false;
  panes.forEach(pane => {
    if (pane.id === `tab-${tabId}`) {
      pane.classList.add('active');
      found = true;
    } else {
      pane.classList.remove('active');
    }
  });

  if (found) {
    links.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Ensure auth updates dashboard UI
if (typeof auth !== 'undefined') {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // Check Email Verification
      if (!user.emailVerified) {
        document.getElementById('verificationBanner').style.display = 'block';
      }

      // Profile Tab
      const displayIdentifier = user.displayName ? user.displayName : user.email;
      const initial = displayIdentifier.charAt(0).toUpperCase();
      const realName = user.displayName ? user.displayName : 'Tech User';
      
      const dashAvatar = document.getElementById('dashAvatar');
      if (user.photoURL) {
        dashAvatar.innerHTML = `<img src="${user.photoURL}" style="width: 100%; height: 100%; object-fit: cover;">`;
      } else {
        dashAvatar.innerText = initial;
      }
      
      document.getElementById('dashName').innerText = realName;
      document.getElementById('dashUsername').innerText = '@' + displayIdentifier;
      document.getElementById('dashEmail').value = user.email;

      // DevCard Tab
      document.getElementById('dcName').innerText = realName;
      document.getElementById('dcUsername').innerText = '@' + displayIdentifier;

      // Fetch API Key from Firestore
      if (typeof db !== 'undefined') {
        try {
          const docRef = db.collection('user_api_keys').doc(user.uid);
          const doc = await docRef.get();
          if (doc.exists) {
            window.userApiKey = doc.data().key;
            document.getElementById('apiKeyDisplay').value = '************************';
          } else {
            // First time login, generate a key
            generateNewApiKey();
          }
        } catch(e) {
          console.error("Error fetching API key", e);
        }
      }

    } else {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
    }
  });
}

async function generateNewApiKey() {
  const user = auth.currentUser;
  if (!user) return;
  
  // Generate random 32 character hex string
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  const key = 'tn_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  window.userApiKey = key;
  document.getElementById('apiKeyDisplay').value = '************************';
  
  try {
    await db.collection('user_api_keys').doc(user.uid).set({
      key: key,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("New API Key generated successfully!");
  } catch(e) {
    console.error("Error saving API key", e);
  }
}

function revealAndCopyApiKey() {
  if (!window.userApiKey) {
    alert("No API key found.");
    return;
  }
  const input = document.getElementById('apiKeyDisplay');
  input.type = 'text';
  input.value = window.userApiKey;
  
  input.select();
  input.setSelectionRange(0, 99999); 
  navigator.clipboard.writeText(input.value).then(() => {
    alert("API Key copied to clipboard!");
    // Hide again after 3 seconds
    setTimeout(() => {
      input.type = 'password';
      input.value = '************************';
    }, 3000);
  });
}

async function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  if (!user) return;
  if (typeof storage === 'undefined') {
    alert("Firebase Storage is not initialized.");
    return;
  }

  // Show a loading state on the avatar
  const dashAvatar = document.getElementById('dashAvatar');
  dashAvatar.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem;"></i>';

  try {
    const fileRef = storage.ref(`avatars/${user.uid}_${Date.now()}`);
    await fileRef.put(file);
    const photoURL = await fileRef.getDownloadURL();
    
    await user.updateProfile({ photoURL: photoURL });
    
    // Update local UI
    dashAvatar.innerHTML = `<img src="${photoURL}" style="width: 100%; height: 100%; object-fit: cover;">`;
    alert("Profile picture updated successfully!");
    window.location.reload(); // Reload to refresh global navbar avatar
  } catch (error) {
    console.error("Error uploading avatar", error);
    alert("Failed to upload image. Make sure Firebase Storage is set up.");
    dashAvatar.innerHTML = 'U'; // Reset
  }
}

window.resendVerification = function() {
  const user = auth.currentUser;
  if (user) {
    user.sendEmailVerification().then(() => {
      alert("Verification email sent! Please check your inbox (and spam folder).");
    }).catch((error) => {
      alert("Error sending email: " + error.message);
    });
  }
};
