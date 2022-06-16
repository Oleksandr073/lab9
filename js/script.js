'use strict';

const BASE_API_URL = 'https://usersdogs.dmytrominochkin.cloud/';

async function callApi(endpoint) {

    const url = BASE_API_URL + endpoint;

    return  await fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject(Error('Failed to load data')))
            .then(response => response.length ? response : Promise.reject(Error('Failed to load data')))
            .catch((error) => {throw error});
}

async function startApp() {
    try {
        const endpoint = 'dogs';
        const response = await callApi(endpoint);

        buildPage(response);
    } catch (error) {
        console.warn(error);
        document.querySelector('body').innerHTML += `
            <div class="error">
                <p>Failed to load data</p>
            </div>
        `;
    } finally {
        document.querySelector('.loader').style.display = 'none';
    }
}

function buildPage(response) {

    function createDogCard(response) {
        response.forEach(({ id, title, sex, age, description, dogImage }) => {
            const parent = document.querySelector('.dogs');
            parent.innerHTML += `
                <li class="dog_item" id="${id}">
                    <div class="dog_photo">
                        <img src=${BASE_API_URL + dogImage} alt="photo of a dog ${title}">
                    </div>
                    <div class="dog_info">
                        <h2 class="dog_name">${title}</h2>
                        <h3 class="dog_sex">${sex.toLowerCase().replace(/\w/, c => c.toUpperCase())}</h3>
                    </div>
                </li>
            `;
        });
    }

    createDogCard(response);

    const modal = document.getElementsByClassName('modal');
    const modalBody = document.getElementsByClassName('modal_body');

    function modalInfo({ id, title, sex, age, description, dogImage }) {
        const scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        modal[0].style.height = `${scrollHeight}px`;
        modal[0].innerHTML = `
            <div class="modal_body active" style="top: ${window.pageYOffset + 30}px">
                <div class="modal_photo">
                <img src="${BASE_API_URL + dogImage}" alt="photo of a dog ${title}">
                </div>
                <div class="modal_info">
                    <h2 class="modal_name">${title}</h2>
                    <p class="modal_suptitle">Sex</p>
                    <h3 class="modal_text sex">${sex.toLowerCase().replace(/\w/, c => c.toUpperCase())}</h3>
                    <p class="modal_suptitle">Age</p>
                    <h3 class="modal_text age">${age}</h3>
                    <p class="modal_suptitle">Personality</p>
                    <p class="modal_text description">${description}</p>
                    <button class="modal_btn">
                        <svg class="modal_ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"/></svg>
                        Adopt Me
                    </button>
                </div>
            </div>
        `;
    }

    document.addEventListener("click", function (event) {
        if (event.target.closest('.dog_item')) {
            modalInfo(response[event.target.closest('.dog_item').id - 1]);
            modal[0].classList.remove('hide');
        }
        else if (!event.target.closest('.modal_body')) {
            modalBody[0].classList.remove('active');
            modal[0].classList.add('hide');
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.code === 'Escape' && !modal[0].classList.contains('hide')) {
            modalBody[0].classList.remove('active');
            modal[0].classList.add('hide');
        }
    });
}

startApp();