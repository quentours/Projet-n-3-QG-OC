
let collectionGenerated = false;
// Définition des fonctions

const openModal = async function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "flex";
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    const menuAjout = document.getElementById("menu-ajout");
    menuAjout.style.display = "flex";
    const sectionAjout = document.getElementById("ajout-photo")
    sectionAjout.style.display = "none"
    document.body.classList.add("modal-open")
    const overlay = document.getElementById("overlay")
    overlay.style.display = "flex"
    
    if (!collectionGenerated) {
        await getCollectionModal();
        collectionGenerated = true;
    }

    async function getCollectionModal () {
        const reponse = await fetch("http://localhost:5678/api/works");
        works = await reponse.json();
        genererCollectionModal(works);
    }
    function genererCollectionModal(works) {
        if (!works || works.length === 0) {
            console.error("La collection est vide ou non définit");
            return
        }

        for (let i=0 ; i< works.length; i++) {
            const vignette = works[i];
            const galleryModal = document.querySelector(".galerie-modal");
            const imageVignette = document.createElement("img")
            imageVignette.src = vignette.imageUrl;

            galleryModal.appendChild(imageVignette);
        }
    }
}

const closeModal = function() {
    const modal = document.getElementById("myModal")
    const ajoutPhoto = document.getElementById("ajout-photo")
    const overlay = document.getElementById("overlay")
    overlay.style.display = "none"
    ajoutPhoto.style.display = "none"
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    document.body.classList.remove("modal-open");

}

const slideModal = function() {
    const ajoutPhoto = document.getElementById("ajout-photo");
    const menuAjout = document.getElementById("menu-ajout");
    menuAjout.style.display = "none";
    ajoutPhoto.style.display = "flex";
    
}

 async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
        const categories = await reponse.json();
        return categories
}

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

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        const renderPicture = document.getElementById("render-picture");
        const inputFile = document.getElementById("file");
        const p1 = document.getElementById("p-frame1");
        const p2 = document.getElementById("p-frame2")
        const logo = document.getElementById("logo-ajout");
        inputFile.style.display = "none";
        p1.style.display = "none";
        p2.style.display = "none";
        logo.style.display = "none";
        renderPicture.classList.add("render");
        renderPicture.appendChild(img);
        inputValider = document.getElementById("valider");
        inputValider.classList.add("ready-to-upload");
    };
    reader.readAsDataURL(file);
}



// Obtention des catégories et attribution à l'input select
const selectElement = document.getElementById("choix-cat");
// selectElement.innerHTML ="";
getCategories().then(categories => {
categories.forEach(category => {
    const option = document.createElement("option");
    option.dataset = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
    });
}).catch(error =>{
    console.error("Erreur leur de la récupération des catégories", error)
})

// Affichage de la modale
const btnModifier = document.getElementById("btn-modifier");
btnModifier.addEventListener("click", openModal);

// Femeture de la modale 
const btnFermer = document.getElementById("close-button");
btnFermer.addEventListener("click", closeModal);

const btnFermer2 = document.getElementById("close-button2");
btnFermer2.addEventListener("click", closeModal);

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
})

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", closeModal);

// Affichage de la deuxième page de la modale
const btnAjout = document.getElementById("btn-ajout");
btnAjout.addEventListener("click", slideModal);

const fileInput = document.getElementById("file");
fileInput.addEventListener("change", handleFileUpload);



