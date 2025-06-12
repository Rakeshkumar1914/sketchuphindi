import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNVpQzPRLol49QdenJEjcAqRwyxIlQk8s",
    authDomain: "hindi-f05ab.firebaseapp.com",
    projectId: "hindi-f05ab",
    storageBucket: "hindi-f05ab.appspot.com",
    messagingSenderId: "796177404338",
    appId: "1:796177404338:web:6349e9c010edc8bf2d54ab"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get category ID from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('category');

// Update category title
const categoryTitle = document.getElementById('category-title');
categoryTitle.textContent = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/([A-Z])/g, ' $1').trim() : 'All Videos';

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300';
    card.innerHTML = `
        <a href="${video.videoUrl}" target="_blank">
                <div class="h-48 overflow-hidden">
                    <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover">
                </div>
                </a>
                `;
    return card;
}
                // <div class="p-4">
                //     <h3 class="font-semibold text-lg mb-2 h-14 overflow-hidden">${truncateText(video.title, 50)}</h3>
                //     <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 h-12 overflow-hidden">${truncateText(video.description, 75)}</p>
                //     <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                //         <span><i class="far fa-calendar-alt mr-2"></i>${video.date}</span>
                //         <span><i class="far fa-clock mr-2"></i>${video.time}</span>
                //     </div>
                // </div>

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function renderVideos(videos) {
    const videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = '';
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoGrid.appendChild(videoCard);
    });
}

function fetchAndRenderVideos() {
    showLoader();
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const filteredPosts = categoryId
                ? Object.values(data).filter(post => post.label === categoryId)
                : Object.values(data);
            renderVideos(filteredPosts);
        } else {
            document.getElementById('video-grid').innerHTML = '<p class="text-center text-gray-500 p-4">No videos found.</p>';
        }
        hideLoader();
    }, {
        onlyOnce: true
    });
}

function searchPosts(query) {
    showLoader();
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const filteredPosts = Object.values(data).filter(post => 
                (post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.description.toLowerCase().includes(query.toLowerCase()) ||
                post.label.toLowerCase().includes(query.toLowerCase())) &&
                (!categoryId || post.label === categoryId)
            );
            renderVideos(filteredPosts);
        }
        hideLoader();
    }, {
        onlyOnce: true
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            searchPosts(query);
        } else {
            fetchAndRenderVideos();
        }
    });

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

function init() {
    fetchAndRenderVideos();
    setupEventListeners();

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);
}

document.addEventListener('DOMContentLoaded', init);
