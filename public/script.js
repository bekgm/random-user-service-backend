const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const content = document.getElementById('content');

const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const userGender = document.getElementById('userGender');
const userAge = document.getElementById('userAge');
const userDob = document.getElementById('userDob');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const userCity = document.getElementById('userCity');
const userCountry = document.getElementById('userCountry');
const userAddress = document.getElementById('userAddress');

const countryFlag = document.getElementById('countryFlag');
const countryName = document.getElementById('countryName');
const countryCapital = document.getElementById('countryCapital');
const countryLanguages = document.getElementById('countryLanguages');
const countryCurrency = document.getElementById('countryCurrency');

const baseCurrency = document.getElementById('baseCurrency');
const rateUSD = document.getElementById('rateUSD');
const rateKZT = document.getElementById('rateKZT');

const newsContainer = document.getElementById('newsContainer');

generateBtn.addEventListener('click', fetchUserData);


async function fetchUserData() {
    try {
        showLoading();
        hideError();
        hideContent();

        const response = await fetch('/api/random-user');
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        displayUserData(data.user);
        displayCountryData(data.countryInfo);
        displayExchangeRates(data.exchangeRates);
        displayNews(data.news);

        hideLoading();
        showContent();

    } catch (error) {
        console.error('Error fetching user data:', error);
        hideLoading();
        showError('Failed to load user data. Please try again.');
    }
}


function displayUserData(user) {
    userPhoto.src = user.picture;
    userPhoto.alt = `${user.firstName} ${user.lastName}`;
    
    userName.textContent = `${user.firstName} ${user.lastName}`;
    userGender.textContent = capitalizeFirst(user.gender);
    userAge.textContent = user.age;
    userDob.textContent = formatDate(user.dob);
    userEmail.textContent = user.email;
    userPhone.textContent = user.phone;
    userCity.textContent = user.city;
    userCountry.textContent = user.country;
    userAddress.textContent = user.address;
}


function displayCountryData(country) {
    if (country.flag) {
        countryFlag.src = country.flag;
        countryFlag.alt = country.flagAlt;
        countryFlag.style.display = 'block';
    } else {
        countryFlag.style.display = 'none';
    }

    countryName.textContent = country.name;
    countryCapital.textContent = country.capital;
    countryLanguages.textContent = country.languages;
    countryCurrency.textContent = country.currency;
}


function displayExchangeRates(rates) {
    baseCurrency.textContent = rates.baseCurrency;
    
    if (rates.toUSD !== 'N/A') {
        rateUSD.textContent = `1 ${rates.baseCurrency} = ${rates.toUSD} USD`;
    } else {
        rateUSD.textContent = 'Not available';
    }

    if (rates.toKZT !== 'N/A') {
        rateKZT.textContent = `1 ${rates.baseCurrency} = ${rates.toKZT} KZT`;
    } else {
        rateKZT.textContent = 'Not available';
    }
}

function displayNews(newsArticles) {
    newsContainer.innerHTML = '';

    if (!newsArticles || newsArticles.length === 0) {
        newsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No news articles available</p>';
        return;
    }

    newsArticles.forEach(article => {
        const newsItem = createNewsItem(article);
        newsContainer.appendChild(newsItem);
    });
}


function createNewsItem(article) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    const imageHTML = article.image 
        ? `<img src="${article.image}" alt="${article.title}" class="news-image" onerror="this.style.display='none'">`
        : '';

    newsItem.innerHTML = `
        ${imageHTML}
        <div class="news-content">
            <span class="news-source">${article.source}</span>
            <h4 class="news-title">${article.title}</h4>
            <p class="news-description">${article.description}</p>
            <a href="${article.url}" target="_blank" class="news-link">
                Read full article →
            </a>
        </div>
    `;

    return newsItem;
}


function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function showContent() {
    content.classList.remove('hidden');
}

function hideContent() {
    content.classList.add('hidden');
}
