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

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

function createVideoCard(video) {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <a href="${video.videoUrl}" target="_blank">
                <div class="h-48 overflow-hidden">
                    <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 h-14 overflow-hidden">${truncateText(video.title, 50)}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 h-12 overflow-hidden">${truncateText(video.description, 75)}</p>
                    
                </div>
            </a>
        </div>
    `;
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function renderSection(sectionId, sectionTitle, videos) {
    const sectionHTML = `
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden mb-8">
            <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">${sectionTitle}</h3>
                    <a href="category.html?category=${sectionId}" class="text-blue-500 hover:underline">View All</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${videos.map(video => createVideoCard(video)).join('')}
                </div>
            </div>
        </div>
    `;
    return sectionHTML;
}

function fetchAndRenderSections() {
    showLoader();
    // const sections = ['bedroom', 'livingRoom', 'kitchen', 'office', 'wardrobe', 'communitySpotlight'];
    const sections = ['zeroToHero','vray', '2024', '2025', 'animation', 'live', 'autocadShorts', 'sketchup-2023', 'stair', 'autoCad','sketchupLessons', 'civil', 'zeroTime', 'fastWork', '1MinVideo', 'skillBooster', 'basicTool'];
    const videosContainer = document.getElementById('videos-container');
    let completedSections = 0;

    sections.forEach(sectionId => {
        const sectionRef = ref(db, 'posts');
        onValue(sectionRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const filteredData = Object.values(data).filter(post => post.label === sectionId);
                const sectionTitle = sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const sectionHTML = renderSection(sectionId, sectionTitle, filteredData.slice(0, 4));
                videosContainer.innerHTML += sectionHTML;
            }
            completedSections++;
            if (completedSections === sections.length) {
                hideLoader();
            }
        }, { onlyOnce: true });
    });
}

function searchPosts(query) {
    showLoader();
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const filteredPosts = Object.values(data).filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.description.toLowerCase().includes(query.toLowerCase()) ||
                post.label.toLowerCase().includes(query.toLowerCase())
            );
            renderSearchResults(filteredPosts);
        }
        hideLoader();
    }, { onlyOnce: true });
}

function renderSearchResults(posts) {
    const searchResultsContainer = document.getElementById('search-results-container');
    const videosSection = document.getElementById('videos-section');
    const searchResultsSection = document.getElementById('search-results');

    searchResultsContainer.innerHTML = '';

    if (posts.length === 0) {
        searchResultsContainer.innerHTML = '<p class="text-center text-gray-500 p-4">No results found.</p>';
    } else {
        posts.forEach(post => {
            const postElement = createVideoCard(post);
            searchResultsContainer.innerHTML += postElement;
        });
    }

    videosSection.classList.add('hidden');
    searchResultsSection.classList.remove('hidden');
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    [searchInput, mobileSearchInput].forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            let heroSection = document.getElementById("heroSection")
            if (query.length >= 1) {
                heroSection.style.display = "none"
                searchPosts(query);
            } else {
                heroSection.style.display = "block"
                document.getElementById('search-results').classList.add('hidden');
                document.getElementById('videos-section').classList.remove('hidden');
            }
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
}

function init() {
    fetchAndRenderSections();
    setupEventListeners();

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);
}

document.addEventListener('DOMContentLoaded', init);