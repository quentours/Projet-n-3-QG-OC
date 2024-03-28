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
        projetElement.classList.add("element")
        // Création des balises

        const imageElement = document.createElement("img");
        imageElement.src = fiche.imageUrl;

        const nomElement = document.createElement("p");
        nomElement.innerText = fiche.title;

        // Ajout de l'ID category comme data attribute

        projetElement.dataset.categoryId = fiche.category.id;

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

// Récupération des catégories : Id + name

async function fetchCategories() {
    try {
        const reponse = await fetch("http://localhost:5678/api/categories")
        const categories = await reponse.json();
        createFilterButtons(categories);
} catch (error) {
    console.error("Erreur dans la récupération des données", error);
    }

}

// Création des boutons en fonction des données de l'API

function createFilterButtons(categories) {
    const boutonsTri = document.querySelector(".bouton-de-tri");
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        button.addEventListener("click", handleFilterClick);
        boutonsTri.appendChild(button);
    });
}

// définition de l'évennement au clic sur un des boutons

function handleFilterClick(event) {
    const categoryId = event.target.dataset.categoryId;
    filterElements(categoryId);
}

// Affichage des éléments en fonction de leur catégorie

function filterElements(categoryId) {
    const elements = document.querySelectorAll(".gallery .element")
       elements.forEach(element => {
        const elementCategoryId = element.dataset.categoryId;
        console.log("Element Category ID:" , elementCategoryId);
        if (categoryId === "all" || categoryId === elementCategoryId) {
            element.style.display = "block";
        } else {
            element.style.display ="none";
        }
    });
}

fetchCategories();

// Switch entre login et logout si l'utilisateur est connecté

document.addEventListener("DOMContentLoaded", function() {
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    const token = localStorage.getItem("token");
    if (token) {
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
    } else {
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
    }

    // Supression du token dans le localStorage au clic sur logout
    const logoutButton = document.getElementById("logout-link");
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("token");
        window.location.href = "file:///C:/xampp/htdocs/Code%20entrainement/Formation%20Dev%20Web%20OpenClassrooms/Partie%203/Projet%203/Projet-n-3-QG-OC/FrontEnd/index.html"
    }) 
})

// affichage du boutton modifier si l'utilisateur est connecté 

document.addEventListener("DOMContentLoaded", function() {
    const btnModifier = document.getElementById("btn-modifier");

    const token = localStorage.getItem("token");

    if (token) {
        btnModifier.style.display = "block";
    } else {
        btnModifier.style.display = "none";
    }
})
