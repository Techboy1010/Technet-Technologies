const SYSTEM_PROMPT = "You are Genius, the AI assistant for Technet Technologies — a premium tech company founded by techboywayne (CEO). Keep responses concise, professional, and helpful. The company offers: custom website creation, software development, app development, school/shop management systems, digital game distribution (GTA 5, Spider-Man Miles Morales), live streaming, and access to premium forex/binary trading via Deriv, Weltrade, and Pocket Option. Phone: +263718294344, Email: technettechnologies01@gmail.com, Social: @techboywayne. Company motto: No Risk No Reward.";
let convaiSessionID = 'sess_' + Math.random().toString(36).substr(2, 9);

async function sendMsg() {
  const input = document.getElementById('chatInput');
  const chatBox = document.getElementById('chatBox');
  if (!input || !chatBox) return;

  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  appendMsg('user', text);
  
  const thinking = document.createElement('div');
  thinking.className = 'thinking';
  thinking.id = 'thinking';
  thinking.textContent = 'Genius is generating response...';
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  try {
    const formData = new FormData();
    formData.append('userText', text);
    formData.append('charID', '424e6fcc-9668-11f1-9835-42010a7be02f');
    formData.append('sessionID', convaiSessionID);
    formData.append('voiceResponse', 'False');

    const resp = await fetch('https://api.convai.com/character/getResponse', {
      method: 'POST',
      headers: {
        'CONVAI-API-KEY': 'e108a73cfd025a3fc39a0298a550e1b7'
      },
      body: formData
    });
    
    const data = await resp.json();
    const reply = data.text || "I am unable to process that request at this time. Please try again.";
      
    const el = document.getElementById('thinking');
    if (el) el.remove();
    
    appendMsg('ai', reply);
  } catch(e) {
    const el = document.getElementById('thinking');
    if (el) el.remove();
    appendMsg('ai', "A connection error occurred. Please try again later.");
  }
}

function appendMsg(role, text) {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;

  const div = document.createElement('div');
  div.className = 'msg ' + role;
  
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  
  div.appendChild(bubble);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fade in observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

// Typewriter Effect
const phrases = ["Digital Innovation.", "Software Engineering.", "Intelligent AI.", "Financial Systems.", "Premium Entertainment."];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
  const typewriter = document.getElementById('typewriter');
  if (!typewriter) return;

  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000; // Pause at end of phrase
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500; // Pause before typing next phrase
  }

  setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  typeEffect();
  injectGeniusWidget();
});

// Floating Genius Widget Logic
function injectGeniusWidget() {
  const widgetHTML = `
    <div class="floating-chat-widget" id="geniusWidget">
      <div class="chat-widget-window" id="geniusWidgetWindow">
        <div class="ai-header">
          <div class="ai-avatar" style="padding: 0; background: none;"><img src="assets/genius_g.jpg" alt="Genius" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"></div>
          <div>
            <div class="ai-name">Genius Assistant</div>
            <div class="ai-status">Ready to assist</div>
          </div>
          <button class="close-widget" onclick="toggleGeniusWidget()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="chat-box" id="widgetChatBox">
          <div class="msg ai">
            <div class="msg-bubble">Hello! I am Genius, the intelligent assistant for Technet Technologies. Ask me anything!</div>
          </div>
        </div>
        <div class="chat-input-row">
          <button class="mic-btn" id="widgetMicBtn" onclick="toggleRecording('widget')"><i class="fa-solid fa-microphone"></i></button>
          <input type="text" id="widgetChatInput" placeholder="Ask me anything..." onkeydown="if(event.key==='Enter')sendWidgetMsg()"/>
          <button class="send-btn" onclick="sendWidgetMsg()">Send</button>
        </div>
      </div>
      <div class="chat-widget-tooltip" id="geniusTooltip">
        Ask me anything! 👋
      </div>
      <button class="chat-widget-toggle" onclick="toggleGeniusWidget()" style="padding: 0; overflow: hidden;">
        <img src="assets/genius_g.jpg" alt="Genius" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
}

function toggleGeniusWidget() {
  const windowEl = document.getElementById('geniusWidgetWindow');
  const tooltip = document.getElementById('geniusTooltip');
  if (windowEl.classList.contains('open')) {
    windowEl.classList.remove('open');
    tooltip.style.display = 'block';
  } else {
    windowEl.classList.add('open');
    tooltip.style.display = 'none';
  }
}

async function sendWidgetMsg() {
  const input = document.getElementById('widgetChatInput');
  const chatBox = document.getElementById('widgetChatBox');
  const text = input.value.trim();
  if (!text) return;

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.innerHTML = `<div class="msg-bubble">${text}</div>`;
  chatBox.appendChild(userMsg);
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // Add typing indicator
  const aiMsg = document.createElement('div');
  aiMsg.className = 'msg ai';
  aiMsg.innerHTML = `<div class="msg-bubble">...</div>`;
  chatBox.appendChild(aiMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const formData = new FormData();
    formData.append('userText', text);
    formData.append('charID', '424e6fcc-9668-11f1-9835-42010a7be02f');
    formData.append('sessionID', convaiSessionID);
    formData.append('voiceResponse', 'False');

    const res = await fetch('https://api.convai.com/character/getResponse', {
      method: 'POST',
      headers: {
        'CONVAI-API-KEY': 'e108a73cfd025a3fc39a0298a550e1b7'
      },
      body: formData
    });
    const data = await res.json();
    aiMsg.innerHTML = `<div class="msg-bubble">${data.text}</div>`;
  } catch(e) {
    aiMsg.innerHTML = `<div class="msg-bubble">Sorry, my systems are currently updating. Please try again later.</div>`;
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Auth Modal Logic
let currentAuthMode = 'signin';

function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    if (mode) {
      setAuthMode(mode);
    }
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function toggleAuthMode() {
  setAuthMode(currentAuthMode === 'signin' ? 'signup' : 'signin');
}

function setAuthMode(mode) {
  currentAuthMode = mode;
  const nameGroup = document.getElementById('nameGroup');
  const title = document.getElementById('modalTitle');
  const sub = document.getElementById('modalSub');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const toggleText = document.getElementById('modalToggleText');
  const toggleLink = document.getElementById('modalToggleLink');

  if (!nameGroup) return; // Prevent errors if elements don't exist

  if (mode === 'signup') {
    nameGroup.style.display = 'block';
    nameGroup.querySelector('input').required = true;
    title.textContent = 'Create an Account';
    sub.textContent = 'Join Technet to access premium features.';
    submitBtn.textContent = 'Register';
    toggleText.textContent = 'Already have an account?';
    toggleLink.textContent = 'Log In';
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) forgotLink.style.display = 'none';
    const authReq = document.getElementById('authRequirements');
    if (authReq) authReq.innerHTML = '<strong style="color:var(--text-main);"><i class="fa-solid fa-shield-halved"></i> Registration Requirements:</strong><br><span style="display:inline-block;margin-top:5px;">• Use a valid active email address<br>• Password must be at least 8 characters<br>• Include uppercase, number, & special symbol</span>';
  } else {
    nameGroup.style.display = 'none';
    nameGroup.querySelector('input').required = false;
    title.textContent = 'Welcome Back';
    sub.textContent = 'Log in to access your Technet account.';
    submitBtn.textContent = 'Log In';
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = 'Register';
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) forgotLink.style.display = 'block';
    const authReq = document.getElementById('authRequirements');
    if (authReq) authReq.innerHTML = '<strong style="color:var(--text-main);"><i class="fa-solid fa-circle-info"></i> Log In Requirements:</strong><br><span style="display:inline-block;margin-top:5px;">• Enter your registered email address<br>• Ensure Caps Lock is off for password<br>• Account must be verified</span>';
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById('authPasswordInput');
  const icon = document.getElementById('togglePasswordIcon');
  if (input && icon) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      icon.style.color = 'var(--primary)';
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      icon.style.color = 'var(--text-muted)';
    }
  }
}

// Voice Recognition & Audio Handling
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

async function toggleRecording(chatType) {
  const micBtnId = chatType === 'widget' ? 'widgetMicBtn' : 'mainMicBtn';
  const micBtn = document.getElementById(micBtnId);
  const chatBoxId = chatType === 'widget' ? 'widgetChatBox' : 'chatBox';
  const chatBox = document.getElementById(chatBoxId);

  if (isRecording) {
    // Stop recording
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    if (micBtn) micBtn.classList.remove('recording');
  } else {
    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Add UI indicator
        const userMsg = document.createElement('div');
        userMsg.className = 'msg user';
        userMsg.innerHTML = `<div class="msg-bubble"><em>🎤 Sent audio message...</em></div>`;
        chatBox.appendChild(userMsg);

        const aiMsg = document.createElement('div');
        aiMsg.className = 'msg ai';
        aiMsg.innerHTML = `<div class="msg-bubble">Listening...</div>`;
        chatBox.appendChild(aiMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'voice.wav');
          formData.append('charID', '1f89b894-0014-11ef-aee2-42010a7be00e');
          formData.append('sessionID', convaiSessionID);
          formData.append('voiceResponse', 'True');

          const res = await fetch('https://api.convai.com/character/getResponse', {
            method: 'POST',
            headers: {
              'CONVAI-API-KEY': 'e25bc6505b329c46e3ed701058560b50'
            },
            body: formData
          });

          const data = await res.json();
          aiMsg.innerHTML = `<div class="msg-bubble">${data.text || '...'}</div>`;
          chatBox.scrollTop = chatBox.scrollHeight;

          if (data.audio) {
            const audio = new Audio("data:audio/wav;base64," + data.audio);
            audio.play();
          }

        } catch (e) {
          aiMsg.innerHTML = `<div class="msg-bubble">Failed to process audio.</div>`;
        }
      };

      mediaRecorder.start();
      isRecording = true;
      if (micBtn) micBtn.classList.add('recording');
    } catch (err) {
      alert('Microphone access is required to use this feature.');
    }
  }
}

// Automatic Origin Carousel Logic
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-indicators .dot');
  let currentSlide = 0;

  if (slides.length > 0 && dots.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = (currentSlide + 1) % slides.length;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }, 4000); // Change image every 4 seconds
  }
});

// Firebase Auth State Management
document.addEventListener('DOMContentLoaded', () => {
  // We check if firebase is defined (from CDN in HTML)
  if (typeof firebase !== 'undefined' && typeof auth !== 'undefined') {
    auth.onAuthStateChanged((user) => {
      const navAuth = document.querySelector('.nav-auth');
      if (user) {
        // User is signed in
        if (navAuth) {
          const displayIdentifier = user.displayName ? user.displayName : user.email;
          const initial = displayIdentifier.charAt(0).toUpperCase();
          const realName = user.displayName ? user.displayName : 'Tech User';
          
          let avatarDisplay = `<div class="user-profile-trigger" onclick="toggleProfileDropdown(event)" title="Account">${initial}</div>`;
          let avatarDropdownDisplay = `<div class="pd-avatar">${initial}</div>`;
          
          if (user.photoURL) {
            avatarDisplay = `<img src="${user.photoURL}" class="user-profile-trigger" onclick="toggleProfileDropdown(event)" title="Account" style="width: 36px; height: 36px; padding: 0; object-fit: cover;">`;
            avatarDropdownDisplay = `<img src="${user.photoURL}" class="pd-avatar" style="width: 48px; height: 48px; padding: 0; object-fit: cover; border-radius: 50%;">`;
          }
          
          navAuth.innerHTML = `
            <div class="nav-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search..." oninput="handleSearch(event)">
              <span class="search-shortcut">⌘K</span>
              <div class="search-results" id="searchResults"></div>
            </div>
            <div class="user-profile-container">
              ${avatarDisplay}
              <div class="profile-dropdown" id="profileDropdown">
                <div class="pd-header">
                   ${avatarDropdownDisplay}
                   <div class="pd-info">
                     <span class="pd-name">${realName}</span>
                     <span class="pd-username">@${displayIdentifier}</span>
                   </div>
                </div>
                <div class="pd-action">
                   <button class="pd-btn-glow" onclick="window.location.href='dashboard.html?tab=api'"><i class="fa-solid fa-sparkles"></i> Get API Access</button>
                </div>
                <div class="pd-divider"></div>
                <a href="dashboard.html?tab=profile" class="pd-item"><i class="fa-regular fa-user"></i> Your profile</a>
                <a href="dashboard.html?tab=achievements" class="pd-item"><i class="fa-solid fa-medal"></i> Achievements</a>
                <a href="dashboard.html?tab=devcard" class="pd-item"><i class="fa-solid fa-address-card"></i> DevCard</a>
                <a href="dashboard.html?tab=analytics" class="pd-item"><i class="fa-solid fa-chart-simple"></i> Analytics</a>
                <div class="pd-divider"></div>
                <div class="pd-theme-toggle">
                   <span>Theme</span>
                   <div class="theme-controls">
                     <i class="fa-solid fa-moon active" onclick="setTheme('dark', event)"></i>
                     <i class="fa-regular fa-sun" onclick="setTheme('light', event)"></i>
                   </div>
                </div>
                <div class="pd-divider"></div>
                <a href="dashboard.html?tab=settings" class="pd-item"><i class="fa-solid fa-gear"></i> Settings</a>
                <a href="dashboard.html?tab=subscriptions" class="pd-item"><i class="fa-regular fa-credit-card"></i> Subscriptions</a>
                <a href="dashboard.html?tab=organizations" class="pd-item"><i class="fa-regular fa-building"></i> Organizations</a>
                <a href="dashboard.html?tab=invite" class="pd-item"><i class="fa-solid fa-user-plus"></i> Invite friends</a>
                <div class="pd-divider"></div>
                <a href="changelog.html" class="pd-item"><i class="fa-solid fa-code-commit"></i> Changelog</a>
                <a href="docs.html" class="pd-item"><i class="fa-solid fa-book"></i> Docs</a>
                <a href="index.html#contact" class="pd-item"><i class="fa-regular fa-life-ring"></i> Support</a>
                <div class="pd-divider"></div>
                <a href="#" class="pd-item" onclick="logoutUser()" style="color: #ff4757;"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out</a>
              </div>
            </div>
          `;
        }
      } else {
        // User is signed out
        if (navAuth) {
          navAuth.innerHTML = `
            <div class="nav-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search..." oninput="handleSearch(event)">
              <span class="search-shortcut">⌘K</span>
              <div class="search-results" id="searchResults"></div>
            </div>
            <a href="login.html" class="btn-auth-text"><i class="fa-solid fa-right-to-bracket"></i> Log In</a>
            <a href="register.html" class="btn-auth-primary">Register <i class="fa-solid fa-arrow-right"></i></a>
          `;
        }
      }
    });
  }
});

function toggleProfileDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown && dropdown.classList.contains('show')) {
    if (!event.target.closest('.user-profile-container')) {
      dropdown.classList.remove('show');
    }
  }
});

function logoutUser() {
  if (typeof auth !== 'undefined') {
    auth.signOut().then(() => {
      window.location.href = 'index.html';
    }).catch((error) => {
      console.error("Sign Out Error", error);
    });
  }
}

// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('cookiesAccepted')) {
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10, 10, 15, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px 24px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      z-index: 9999;
      width: 90%;
      max-width: 600px;
      transition: opacity 0.4s ease;
    `;
    
    banner.innerHTML = `
      <div style="flex: 1;">
        <h4 style="color: var(--text-main); margin-bottom: 6px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-cookie-bite" style="color: var(--primary);"></i> Cookie Preferences
        </h4>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0; line-height: 1.4;">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
        </p>
      </div>
      <div>
        <button onclick="acceptCookies()" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.85rem; border-radius: 8px;">Accept All</button>
      </div>
    `;
    document.body.appendChild(banner);
  }
});

window.acceptCookies = function() {
  localStorage.setItem('cookiesAccepted', 'true');
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 400);
  }
};

// Password Visibility Toggle
window.togglePasswordVisibility = function() {
  const passwordInputs = document.querySelectorAll('input[type="password"], input.password-toggle');
  const icons = document.querySelectorAll('.fa-eye, .fa-eye-slash');
  
  passwordInputs.forEach(input => {
    if (input.type === 'password') {
      input.type = 'text';
      input.classList.add('password-toggle');
    } else {
      input.type = 'password';
      input.classList.remove('password-toggle');
    }
  });

  icons.forEach(icon => {
    if (icon.classList.contains('fa-eye')) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else if (icon.classList.contains('fa-eye-slash')) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
};

// Global Theme Management
window.initTheme = function() {
  const savedTheme = localStorage.getItem('technet_theme') || 'dark';
  applyTheme(savedTheme);
};

window.setTheme = function(theme, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  localStorage.setItem('technet_theme', theme);
  applyTheme(theme);
};

window.applyTheme = function(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  // Update icons if present
  const moon = document.querySelector('.fa-moon');
  const sun = document.querySelector('.fa-sun');
  if (moon && sun) {
    if (theme === 'light') {
      moon.classList.remove('active');
      sun.classList.add('active');
    } else {
      moon.classList.add('active');
      sun.classList.remove('active');
    }
  }
};

// Initialize theme immediately on script load
window.initTheme();

// Global Search Logic
const searchIndex = [
  { title: 'Home', url: 'index.html', category: 'Pages' },
  { title: 'Services', url: 'services.html', category: 'Pages' },
  { title: 'Gaming Hub', url: 'gaming.html', category: 'Pages' },
  { title: 'Financial Trading', url: 'trading.html', category: 'Pages' },
  { title: 'Genius AI', url: 'genius.html', category: 'Pages' },
  { title: 'Dashboard', url: 'dashboard.html', category: 'Portal' },
  { title: 'API Documentation', url: 'docs.html', category: 'Resources' },
  { title: 'Changelog', url: 'changelog.html', category: 'Resources' },
  { title: 'Contact Support', url: 'index.html#contact', category: 'Action' }
];

window.handleSearch = function(event) {
  const query = event.target.value.toLowerCase().trim();
  const resultsContainer = document.getElementById('searchResults');
  
  if (!resultsContainer) return;

  if (query.length === 0) {
    resultsContainer.classList.remove('active');
    resultsContainer.innerHTML = '';
    return;
  }

  const filtered = searchIndex.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));

  if (filtered.length === 0) {
    resultsContainer.innerHTML = '<div class="search-result-item"><span style="color: var(--text-muted);">No results found.</span></div>';
  } else {
    resultsContainer.innerHTML = filtered.map(item => `
      <a href="${item.url}" class="search-result-item">
        <span>${item.title}</span>
        <span class="search-result-category">${item.category}</span>
      </a>
    `).join('');
  }
  
  resultsContainer.classList.add('active');
};

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  const resultsContainer = document.getElementById('searchResults');
  if (resultsContainer && !e.target.closest('.nav-search')) {
    resultsContainer.classList.remove('active');
  }
});


function openDonateModal() {
  document.getElementById('donateModal').style.display = 'flex';
}

function closeDonateModal() {
  document.getElementById('donateModal').style.display = 'none';
}
