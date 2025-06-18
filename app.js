// State Management
let state = {
    videos: [],
    currentUser: null,
    subscriptions: [],
    currentVideo: null,
    comments: {},
    likes: {},
    dislikes: {},
    users: {},
    theme: 'light'
};

// Set your deployed Worker URL here
const WORKER_URL = 'https://gemini-api-proxy.vaxo-gr2.workers.dev';

// Load state from localStorage
function loadState() {
    console.log('Loading state...');
    
    // Always initialize with sample videos first
    state.videos = [...sampleVideos];
    
    // Clear localStorage to ensure fresh start
    localStorage.removeItem('videoShareState');
    
    // Initialize missing data for each video
    state.videos.forEach(video => {
        if (!state.comments[video.id]) {
            state.comments[video.id] = generateRandomComments();
        }
        if (!state.likes[video.id]) {
            state.likes[video.id] = new Set();
        }
        if (!state.dislikes[video.id]) {
            state.dislikes[video.id] = new Set();
        }
    });
    
    console.log('Loaded state with', state.videos.length, 'videos');
    
    // Save the updated state
    saveState();
}

// Save state to localStorage
function saveState() {
    try {
        const stateToSave = {
            ...state,
            likes: Object.fromEntries(
                Object.entries(state.likes).map(([key, value]) => [key, Array.from(value)])
            ),
            dislikes: Object.fromEntries(
                Object.entries(state.dislikes).map(([key, value]) => [key, Array.from(value)])
            )
        };
        localStorage.setItem('videoShareState', JSON.stringify(stateToSave));
        console.log('State saved successfully');
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

// Generate random comments
function generateRandomComments() {
    const commenters = ['JohnDoe', 'JaneSmith', 'MikeJohnson', 'SarahWilliams', 'AlexBrown'];
    const comments = [
        'Great video! Really enjoyed watching this.',
        'Thanks for sharing this content!',
        'This is exactly what I was looking for.',
        'Keep up the good work!',
        'Very informative and well-presented.',
        'I learned a lot from this video.',
        'This is my new favorite channel!',
        'The quality is amazing!',
        'Can\'t wait for more content like this.',
        'This helped me a lot, thank you!'
    ];
    
    return Array.from({ length: 5 }, () => ({
        user: commenters[Math.floor(Math.random() * commenters.length)],
        text: comments[Math.floor(Math.random() * comments.length)],
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
}

// Initialize the application
function init() {
    console.log('Initializing application...');
    loadState();
    setupEventListeners();
    
    // Show initial page based on URL hash or default to home
    const hash = window.location.hash.slice(1) || 'home';
    const pageId = hash === 'home' ? 'homePage' : `${hash}Page`;
    showPage(pageId);
    
    // Update active category based on current page
    const category = hash === 'home' ? 'all' : hash;
    document.querySelectorAll('.categories li').forEach(cat => {
        cat.classList.toggle('active', cat.dataset.category === category);
    });

    // Force a re-render of all videos
    renderAllPages();
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (loginBtn) loginBtn.addEventListener('click', () => showAuthModal('login'));
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Auth modal
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', hideAuthModal);
    }

    // Auth forms
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);

    // Category navigation
    document.querySelectorAll('.categories li').forEach(category => {
        category.addEventListener('click', () => handleCategorySelect(category));
    });

    // Library navigation
    document.querySelectorAll('.library li').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) {
                showPage(`${page}Page`);
            }
        });
    });

    // Video player controls
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const postCommentBtn = document.getElementById('postCommentBtn');
    const subscribeBtn = document.getElementById('subscribeBtn');
    
    if (likeBtn) likeBtn.addEventListener('click', handleLike);
    if (dislikeBtn) dislikeBtn.addEventListener('click', handleDislike);
    if (postCommentBtn) postCommentBtn.addEventListener('click', handleComment);
    if (subscribeBtn) subscribeBtn.addEventListener('click', handleSubscribe);

    // Logo click to navigate to home
    const homeLogo = document.getElementById('homeLogo');
    if (homeLogo) {
        homeLogo.addEventListener('click', () => {
            showPage('homePage');
            renderVideos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelectorAll('.categories li').forEach(cat => {
                cat.classList.toggle('active', cat.dataset.category === 'all');
            });
        });
    }

    // Upload form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleVideoUpload);
    }

    // Show more button for recommended videos
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            recommendedVideosPage++;
            const currentVideoId = window.location.hash.split('/')[1];
            renderRecommendedVideos(currentVideoId);
        });
    }
}

// Render all pages
function renderAllPages() {
    console.log('Rendering all pages...');
    renderVideos();
    renderTrendingVideos();
    renderCategoryVideos('music');
    renderCategoryVideos('gaming');
    renderCategoryVideos('education');
}

// Video Rendering
function renderVideos(filteredVideos = null) {
    const videos = filteredVideos || state.videos;
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) {
        console.error('Video grid not found');
        return;
    }

    console.log('Rendering', videos.length, 'videos');
    videoGrid.innerHTML = '';
    
    if (videos.length === 0) {
        videoGrid.innerHTML = `
            <div class="no-content-message">
                <i class="fas fa-video-slash"></i>
                <p>No videos found</p>
            </div>
        `;
        return;
    }

    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoGrid.appendChild(videoCard);
    });
}

function renderTrendingVideos() {
    const trendingVideos = [...state.videos]
        .sort((a, b) => {
            const scoreA = (a.likes * 0.7) + (a.views * 0.3);
            const scoreB = (b.likes * 0.7) + (b.views * 0.3);
            return scoreB - scoreA;
        })
        .slice(0, 6);

    const trendingGrid = document.getElementById('trendingGrid');
    if (!trendingGrid) return;

    trendingGrid.innerHTML = '';
    trendingVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        trendingGrid.appendChild(videoCard);
    });
}

function renderCategoryVideos(category) {
    const categoryVideos = state.videos.filter(video => video.category === category);
    const categoryGrid = document.getElementById(`${category}Grid`);
    if (!categoryGrid) return;

    categoryGrid.innerHTML = '';
    categoryVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        categoryGrid.appendChild(videoCard);
    });
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.videoId = video.id;
    card.innerHTML = `
        <img src="${video.thumbnail || 'placeholder.jpg'}" alt="${video.title}" class="video-thumbnail">
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-uploader">${video.uploader}</p>
            <div class="video-stats">
                <span>${formatNumber(video.views)} views</span>
                <span>${formatNumber(video.likes)} likes</span>
            </div>
        </div>
    `;

    // Add click event listener to the entire card
    card.addEventListener('click', () => {
        playVideo(video);
    });

    return card;
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Category Selection
function handleCategorySelect(categoryElement) {
    document.querySelectorAll('.categories li').forEach(cat => {
        cat.classList.remove('active');
    });
    categoryElement.classList.add('active');

    const category = categoryElement.dataset.category;
    if (category === 'trending') {
        showPage('trendingPage');
    } else if (category === 'all') {
        showPage('homePage');
    } else {
        showPage(`${category}Page`);
    }
}

// Search Functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const filteredVideos = state.videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.uploader.toLowerCase().includes(searchTerm)
    );

    // Show results in the current page's grid
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        const videoGrid = currentPage.querySelector('.video-grid');
        if (videoGrid) {
            videoGrid.innerHTML = '';
            if (filteredVideos.length === 0) {
                videoGrid.innerHTML = `
                    <div class="no-content-message">
                        <i class="fas fa-search"></i>
                        <p>No videos found matching "${searchTerm}"</p>
                    </div>
                `;
            } else {
                filteredVideos.forEach(video => {
                    const videoCard = createVideoCard(video);
                    videoGrid.appendChild(videoCard);
                });
            }
        }
    }

    // Update URL hash if on home page
    if (document.getElementById('homePage').classList.contains('active')) {
        window.location.hash = searchTerm ? `search=${encodeURIComponent(searchTerm)}` : '';
    }
}

// UI Updates
function updateUI() {
    const isLoggedIn = state.currentUser !== null;
    document.getElementById('loginBtn').classList.toggle('hidden', isLoggedIn);
    document.getElementById('logoutBtn').classList.toggle('hidden', !isLoggedIn);
    
    if (isLoggedIn) {
        document.querySelector('.user-info').textContent = state.currentUser.username;
    }
}

// Theme Management
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    saveState();
    
    const icon = document.querySelector('#themeToggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Auth Functions
function showAuthModal(tab) {
    const authModal = document.getElementById('authModal');
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.add('active');
}

// Login Function
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${WORKER_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (data.success === true) {
            // Login successful
            state.currentUser = data.user;
            saveState();
            updateUI();
            
            // Reset the login form
            document.getElementById('loginForm').reset();
            
            // Hide the modal
            const authModal = document.getElementById('authModal');
            authModal.classList.remove('modal');
            authModal.classList.add('hidden');
            document.body.style.overflow = '';
            
            showNotification('Authorized successfully!', 'success');
            return;
        }

        // Login failed
        showNotification(data.error || 'Login failed', 'error');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred during login', 'error');
    }
}

// Sign Up Function
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch(`${WORKER_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification('Account created successfully! Please log in.', 'success');
            // Switch to login tab
            switchAuthTab('login');
            // Clear signup form
            document.getElementById('signupForm').reset();
        } else {
            showNotification(data.error || 'Signup failed', 'error');
        }
    } catch (error) {
        showNotification('An error occurred during signup', 'error');
        console.error('Signup error:', error);
    }
}

function logout() {
    state.currentUser = null;
    saveState();
    updateUI();
}

// Video Playback
function playVideo(video) {
    state.currentVideo = video;
    video.views++;
    saveState();

    // Update video player
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = video.videoUrl;
    videoPlayer.load(); // Force video to load with new source
    videoPlayer.play().catch(error => {
        console.log("Video play failed:", error);
    });

    // Update video info
    document.getElementById('videoTitle').textContent = video.title;
    document.getElementById('videoDescription').textContent = video.description;
    document.getElementById('videoViews').textContent = `${formatNumber(video.views)} views`;
    document.getElementById('uploadDate').textContent = new Date(video.uploadDate).toLocaleDateString();
    document.getElementById('likeCount').textContent = formatNumber(video.likes);
    document.getElementById('dislikeCount').textContent = formatNumber(video.dislikes);
    
    // Update channel info
    document.getElementById('channelName').textContent = video.uploader;
    document.getElementById('channelAvatar').src = `https://picsum.photos/seed/${video.uploader}/50/50`;
    document.getElementById('subscriberCount').textContent = `${formatNumber(Math.floor(Math.random() * 1000000))} subscribers`;

    // Update subscribe button
    const subscribeBtn = document.getElementById('subscribeBtn');
    subscribeBtn.classList.toggle('subscribed', state.subscriptions.includes(video.uploader));
    subscribeBtn.textContent = state.subscriptions.includes(video.uploader) ? 'Subscribed' : 'Subscribe';

    // Load comments
    loadComments(video.id);
    
    // Load recommended videos
    loadRecommendedVideos(video);
    
    // Show video page
    showPage('videoPage');
}

// Comments Management
function loadComments(videoId) {
    const comments = state.comments[videoId] || [];
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <img src="https://picsum.photos/seed/${comment.user}/40/40" alt="${comment.user}" class="comment-avatar">
                <div class="comment-info">
                    <strong>${comment.user}</strong>
                    <small>${new Date(comment.date).toLocaleDateString()}</small>
                </div>
            </div>
            <p class="comment-text">${comment.text}</p>
        `;
        commentsList.appendChild(commentElement);
    });
}

function handleComment() {
    if (!state.currentUser) {
        showAuthModal();
        return;
    }

    const commentText = document.getElementById('commentInput').value;
    if (!commentText.trim()) return;

    const videoId = state.currentVideo.id;
    const comment = {
        user: state.currentUser.username,
        text: commentText,
        date: new Date().toISOString()
    };

    if (!state.comments[videoId]) {
        state.comments[videoId] = [];
    }
    state.comments[videoId].unshift(comment);
    saveState();

    document.getElementById('commentInput').value = '';
    loadComments(videoId);
}

// Engagement
function handleLike() {
    if (!state.currentUser) {
        showAuthModal();
        return;
    }

    const video = state.currentVideo;
    if (!state.likes[video.id]) {
        state.likes[video.id] = new Set();
    }

    if (state.likes[video.id].has(state.currentUser)) {
        state.likes[video.id].delete(state.currentUser);
        video.likes--;
    } else {
        state.likes[video.id].add(state.currentUser);
        video.likes++;
        if (state.dislikes[video.id]?.has(state.currentUser)) {
            state.dislikes[video.id].delete(state.currentUser);
            video.dislikes--;
        }
    }

    saveState();
    document.getElementById('likeCount').textContent = formatNumber(video.likes);
    document.getElementById('dislikeCount').textContent = formatNumber(video.dislikes);
    
    // Update liked videos page if we're on it
    if (document.getElementById('likedPage').classList.contains('active')) {
        renderLikedVideos();
    }

    // Update the video in the state
    const videoIndex = state.videos.findIndex(v => v.id === video.id);
    if (videoIndex !== -1) {
        state.videos[videoIndex] = video;
        saveState();
    }
}

function handleDislike() {
    if (!state.currentUser) {
        showAuthModal();
        return;
    }

    const video = state.currentVideo;
    if (!state.dislikes[video.id]) {
        state.dislikes[video.id] = new Set();
    }

    if (state.dislikes[video.id].has(state.currentUser)) {
        state.dislikes[video.id].delete(state.currentUser);
        video.dislikes--;
    } else {
        state.dislikes[video.id].add(state.currentUser);
        video.dislikes++;
        if (state.likes[video.id]?.has(state.currentUser)) {
            state.likes[video.id].delete(state.currentUser);
            video.likes--;
        }
    }

    saveState();
    document.getElementById('likeCount').textContent = formatNumber(video.likes);
    document.getElementById('dislikeCount').textContent = formatNumber(video.dislikes);

    // Update the video in the state
    const videoIndex = state.videos.findIndex(v => v.id === video.id);
    if (videoIndex !== -1) {
        state.videos[videoIndex] = video;
        saveState();
    }
}

// Navigation
function handleNavigation() {
    // Handle category clicks
    document.querySelectorAll('.categories li').forEach(category => {
        category.addEventListener('click', () => {
            const categoryName = category.dataset.category;
            
            // Update active state
            document.querySelectorAll('.categories li').forEach(cat => {
                cat.classList.remove('active');
            });
            category.classList.add('active');

            // Navigate based on category
            if (categoryName === 'all') {
                window.location.href = 'index.html';
            } else if (categoryName === 'trending') {
                window.location.href = 'index.html#trending';
            } else {
                window.location.href = `index.html#${categoryName}`;
            }
        });
    });

    // Handle library navigation
    const subscriptionsBtn = document.getElementById('subscriptionsBtn');

    if (subscriptionsBtn) {
        subscriptionsBtn.addEventListener('click', () => {
            if (window.location.pathname.includes('history.html')) {
                window.location.href = 'index.html#subscriptions';
            } else {
                showPage('subscriptionsPage');
                scrollToSection('subscriptionsPage');
            }
        });
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Page Navigation
function showPage(pageId) {
    console.log('Showing page:', pageId);
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Render appropriate content based on page
        switch(pageId) {
            case 'homePage':
                renderVideos();
                break;
            case 'trendingPage':
                renderTrendingVideos();
                break;
            case 'musicPage':
                renderCategoryVideos('music');
                break;
            case 'gamingPage':
                renderCategoryVideos('gaming');
                break;
            case 'educationPage':
                renderCategoryVideos('education');
                break;
            case 'subscriptionsPage':
                renderSubscriptions();
                break;
            case 'likedPage':
                renderLikedVideos();
                break;
            case 'videoPage':
                // Video page content is handled by playVideo function
                break;
        }
    }
}

// Subscription Management
function handleSubscribe() {
    if (!state.currentUser) {
        showAuthModal();
        return;
    }

    const video = state.currentVideo;
    const subscribeBtn = document.getElementById('subscribeBtn');
    
    if (state.subscriptions.includes(video.uploader)) {
        state.subscriptions = state.subscriptions.filter(channel => channel !== video.uploader);
        subscribeBtn.classList.remove('subscribed');
        subscribeBtn.textContent = 'Subscribe';
    } else {
        state.subscriptions.push(video.uploader);
        subscribeBtn.classList.add('subscribed');
        subscribeBtn.textContent = 'Subscribed';
    }
    
    saveState();
    renderSubscriptions();
}

// Recommended Videos
function loadRecommendedVideos(currentVideo) {
    const recommendedVideos = state.videos
        .filter(video => 
            video.id !== currentVideo.id && 
            video.category === currentVideo.category
        )
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    const recommendedContainer = document.getElementById('recommendedVideos');
    recommendedContainer.innerHTML = '';

    recommendedVideos.forEach(video => {
        const recommendedVideo = document.createElement('div');
        recommendedVideo.className = 'recommended-video';
        recommendedVideo.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="recommended-thumbnail">
            <div class="recommended-info">
                <h4 class="recommended-title">${video.title}</h4>
                <p class="recommended-channel">${video.uploader}</p>
                <p class="recommended-stats">${formatNumber(video.views)} views</p>
            </div>
        `;
        recommendedVideo.addEventListener('click', () => playVideo(video));
        recommendedContainer.appendChild(recommendedVideo);
    });
}

// Subscription Management
function renderSubscriptions() {
    const subscriptionsGrid = document.getElementById('subscriptionsGrid');
    subscriptionsGrid.innerHTML = '';

    const subscribedVideos = state.videos.filter(video => 
        state.subscriptions.includes(video.uploader)
    );

    subscribedVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        subscriptionsGrid.appendChild(videoCard);
    });
}

// Liked Videos Management
function renderLikedVideos() {
    const likedGrid = document.getElementById('likedGrid');
    if (!likedGrid) return;

    likedGrid.innerHTML = '';

    // Get all videos that the current user has liked
    const likedVideos = state.videos.filter(video => 
        state.likes[video.id]?.has(state.currentUser)
    );

    if (likedVideos.length === 0) {
        likedGrid.innerHTML = `
            <div class="no-content-message">
                <i class="fas fa-heart-broken"></i>
                <p>You haven't liked any videos yet</p>
            </div>
        `;
        return;
    }

    likedVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        likedGrid.appendChild(videoCard);
    });
}

// Video Upload Functionality
function handleVideoUpload(event) {
    event.preventDefault();
    
    // Check if user is logged in
    if (!state.currentUser) {
        showNotification('Please log in to upload videos', 'error');
        return;
    }

    const form = event.target;
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value;
    const videoFile = form.video.files[0];
    const thumbnailFile = form.thumbnail.files[0];

    // Validate inputs
    if (!title || !description || !category || !videoFile) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Validate video file size (max 50MB)
    if (videoFile.size > 50 * 1024 * 1024) {
        showNotification('Video file size must be less than 50MB', 'error');
        return;
    }

    // Show loading notification
    showNotification('Uploading video...', 'info');

    // Process video file
    const reader = new FileReader();
    reader.onload = function(e) {
        const videoData = e.target.result;
        
        // Process thumbnail if provided
        let thumbnailData = null;
        if (thumbnailFile) {
            const thumbnailReader = new FileReader();
            thumbnailReader.onload = function(e) {
                thumbnailData = e.target.result;
                saveVideo(title, description, category, videoData, thumbnailData);
            };
            thumbnailReader.readAsDataURL(thumbnailFile);
        } else {
            saveVideo(title, description, category, videoData, thumbnailData);
        }
    };
    reader.readAsDataURL(videoFile);
}

function saveVideo(title, description, category, videoData, thumbnailData) {
    // Create new video object
    const newVideo = {
        id: Date.now().toString(),
        title: title,
        description: description,
        category: category,
        uploader: state.currentUser.username,
        uploadDate: new Date().toISOString(),
        views: 0,
        likes: 0,
        dislikes: 0,
        videoUrl: videoData,
        thumbnail: thumbnailData || 'https://via.placeholder.com/320x180?text=No+Thumbnail'
    };

    // Add video to state and data.js
    state.videos.unshift(newVideo);
    addNewVideo(newVideo);

    // Initialize comments, likes, and dislikes for the new video
    if (!state.comments[newVideo.id]) {
        state.comments[newVideo.id] = [];
    }
    if (!state.likes[newVideo.id]) {
        state.likes[newVideo.id] = new Set();
    }
    if (!state.dislikes[newVideo.id]) {
        state.dislikes[newVideo.id] = new Set();
    }

    // Save state
    saveState();

    // Show success notification
    showNotification('Video uploaded successfully!', 'success');

    // Reset form
    document.getElementById('uploadForm').reset();

    // Redirect to the uploaded video
    window.location.hash = `#video/${newVideo.id}`;
}

// Recommended Videos Functionality
let recommendedVideosPage = 1;
const videosPerPage = 8;

function renderRecommendedVideos(currentVideoId) {
    const recommendedVideosContainer = document.getElementById('recommendedVideos');
    const showMoreBtn = document.getElementById('showMoreBtn');
    
    // Filter out the current video and get recommended videos
    const recommendedVideos = state.videos
        .filter(video => video.id !== currentVideoId)
        .sort((a, b) => b.views - a.views); // Sort by views

    // Calculate the number of videos to show
    const startIndex = 0;
    const endIndex = recommendedVideosPage * videosPerPage;
    const videosToShow = recommendedVideos.slice(startIndex, endIndex);

    // Clear existing videos if it's the first page
    if (recommendedVideosPage === 1) {
        recommendedVideosContainer.innerHTML = '';
    }

    // Add new videos
    videosToShow.forEach(video => {
        const videoElement = createRecommendedVideoElement(video);
        recommendedVideosContainer.appendChild(videoElement);
    });

    // Show/hide the "Show More" button
    if (endIndex >= recommendedVideos.length) {
        showMoreBtn.style.display = 'none';
    } else {
        showMoreBtn.style.display = 'flex';
    }
}

function createRecommendedVideoElement(video) {
    const div = document.createElement('div');
    div.className = 'recommended-video';
    div.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" class="recommended-thumbnail">
        <div class="recommended-info">
            <h4 class="recommended-title">${video.title}</h4>
            <p class="recommended-channel">${video.uploader}</p>
            <p class="recommended-stats">${formatNumber(video.views)} views • ${formatDate(video.uploadDate)}</p>
        </div>
    `;
    
    div.addEventListener('click', () => {
        window.location.hash = `#video/${video.id}`;
    });
    
    return div;
}

// Update the video page rendering to include recommended videos
function renderVideoPage(videoId) {
    // ... existing video page rendering code ...

    // Reset recommended videos page and render recommended videos
    recommendedVideosPage = 1;
    renderRecommendedVideos(videoId);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    init();
}); 