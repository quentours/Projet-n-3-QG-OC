// Récupération des travaux depuis l'API
async function getCollection() {
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

genererCollection(works);
}

function genererCollection(works) {
    for (let i=0; i < works.length; i++) {
        const fiche = works[i];
        // Récupérationd de l'élément DOM qui accueillera les différents projet
        const gallery = document.querySelector(".gallery");
        // Création d'une balise dédiée à un projet
        const projetElement = document.createElement("div");

        // Création des balises

        const imageElement = document.createElement("img");
        imageElement.src = fiche.imageUrl;

        const nomElement = document.createElement("p");
        nomElement.innerText = fiche.title;

        // On rattache nos balises au DOM

        gallery.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(nomElement);

    }

}

getCollection()