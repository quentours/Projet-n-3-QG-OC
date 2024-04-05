// Récupération des travaux depuis l'API
async function getCollection() {
    const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();

genererCollection(works);
}


// Fonction pour créer la collection à partir des données récupérées par la requête à l'API

function genererCollection(works) {
    if (!works || works.length ===0) {
        console.error("La collection est vide ou non définit");
        return
    }


    for (let i=0; i < works.length; i++) {
        const fiche = works[i];
        const categoryId = parseInt(fiche.category.id);
            const category = {id: categoryId, name: fiche.category};
            fiche.category= category;   
        if (fiche.category && categoryId ) {
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

        projetElement.dataset.categoryId = categoryId;

        // On rattache nos balises au DOM


        gallery.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(nomElement);
        

    } else {
        console.error("categorie ou id manquante(s) dans fiche:", fiche);
        }
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

// définition de l'évennement au clic sur un des boutons (filtration et changement de couleur du bouton)

function handleFilterClick(event) {
    const categoryId = parseInt(event.target.dataset.categoryId);

    const boutonsTri = document.querySelectorAll("#portfolio .bouton-de-tri button");
    boutonsTri.forEach(btn => {
        btn.classList.remove("selected");
    });

    event.target.classList.add("selected");

    filterElements(categoryId);
}

btnTous = document.querySelector(".btn-tous");
btnTous.addEventListener("click" , function(event) {
    handleFilterClick(event);
    getCollection();
} );


// Affichage des éléments en fonction de leur catégorie

function filterElements(categoryId) {
    const elements = document.querySelectorAll(".gallery .element")
       elements.forEach(element => {
        const elementCategoryId = parseInt(element.dataset.categoryId);
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

    const token = sessionStorage.getItem("token");
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
        sessionStorage.removeItem("token");
        window.location.href = "./index.html"
    }) 
})

// affichage du boutton modifier et du bandeau "mode édition" si l'utilisateur est connecté 

document.addEventListener("DOMContentLoaded", function() {
    const btnModifier = document.getElementById("btn-modifier");
    const modeEditionContainer = document.getElementById("edition");
    const editionFrame = document.getElementById("edition-frame")

    const token = sessionStorage.getItem("token");

    if (token) {
        editionFrame.style.display = "flex"
        modeEditionContainer.style.display = "flex"
        btnModifier.style.display = "block";
    } else {
        editionFrame.style.display = "none"
        modeEditionContainer.style.display = "none"
        btnModifier.style.display = "none";
    }
})
