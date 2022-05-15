
const url = 'https://usersdogs.dmytrominochkin.cloud/';

fetch(`${url}dogs`)
.then(response => response.json())
.then(massiv => {

    const dog = document.querySelector('.dog');
    const dogs = document.getElementsByClassName('dog_item');
    dogs[0].style.visibility = 'visible';

    if (massiv.length == 0) dogs[0].style.visibility = 'hidden';
    for (let i = 1; i < massiv.length; i++) {
        dog.append(dogs[0].cloneNode(true));
    }

    const dogName = document.querySelectorAll('.dog_name');
    const dogSex = document.querySelectorAll('.dog_sex');
    const dogPhoto = document.querySelectorAll('.dog_photo img');

    for (let i = 0; i < massiv.length; i++) {
        dogs[i].id = massiv[i].id.toString();
        dogName[i].textContent = massiv[i].title;
        dogSex[i].textContent = massiv[i].sex.toLowerCase().replace(/\w/, c => `${c.toUpperCase()}`);
        dogPhoto[i].src = url + massiv[i].dogImage;
        dogPhoto[i].setAttribute('alt', `photo of a dog ${massiv[i].title}`);
    }

    const modal = document.querySelector('.modal');
    const modalBody = document.querySelector('.modal_body');
    const modalPhoto = document.querySelector('.modal_photo img');
    const modalName = document.querySelector('.modal_name');
    const modalSex = document.querySelector('.sex');
    const modalAge = document.querySelector('.age');
    const modalDesc = document.querySelector('.description');

    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    modal.style.height = `${scrollHeight}px`;

    function modalInfo(id) {
        modalPhoto.src = url + massiv[id - 1].dogImage;
        modalPhoto.setAttribute('alt', `photo of a dog ${massiv[id - 1].title}`);
        modalName.textContent = massiv[id - 1].title;
        modalSex.textContent = massiv[id - 1].sex.toLowerCase().replace(/\w/, c => `${c.toUpperCase()}`);
        modalAge.textContent = massiv[id - 1].age;
        modalDesc.textContent = massiv[id - 1].description;
    }

    document.addEventListener("click", function (event) {
        if (event.target.closest('.dog_item')) {
            modalInfo(Number(event.target.id));
            modalBody.style.top = window.pageYOffset + 30 + 'px';
            modal.removeAttribute('hidden');
        }
        else if (!event.target.closest('.modal_body')) {
            modal.setAttribute('hidden', '');
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.code === 'Escape') {
            modal.setAttribute('hidden', '');
        }
    });

})
.catch(() => {
    document.querySelector('.dog_item').style.visibility = 'hidden';
    document.querySelector('body').style.backgroundColor = 'red';
})