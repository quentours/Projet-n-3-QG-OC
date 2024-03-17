let works;

// Récupération des travaux depuis l'API
async function getCollection() {
const reponse = await fetch("http://localhost:5678/api/works");
works = await reponse.json();

genererCollection(works);
}

function genererCollection(works) {
    if (!works || works.length ===0) {
        console.error("La collection est vide ou non définit");
        return
    }



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

// Gestions des boutons

const boutonTous = document.querySelector(".btn-tous");

boutonTous.addEventListener("click" ,function() {
    document.querySelector (".gallery").innerHTML="";
    genererCollection(works);
    });
    

const boutonObjet = document.querySelector(".btn-objet");

boutonObjet.addEventListener("click" ,function() {
    const ProjetFiltres = works.filter(function (work) {
        return work.category.id === 1;
    });
    document.querySelector (".gallery").innerHTML="";
    genererCollection(ProjetFiltres);
})

const boutonAppartement = document.querySelector(".btn-appartement");

boutonAppartement.addEventListener("click" ,function() {
    const ProjetFiltres = works.filter(function (work) {
        return work.category.id === 2;
    });
    document.querySelector (".gallery").innerHTML="";
    genererCollection(ProjetFiltres);
})

const boutonHotel = document.querySelector(".btn-hotel");

boutonHotel.addEventListener("click" ,function() {
    const ProjetFiltres = works.filter(function (work) {
        return work.category.id === 3;
    });
    document.querySelector (".gallery").innerHTML="";
    genererCollection(ProjetFiltres);
})