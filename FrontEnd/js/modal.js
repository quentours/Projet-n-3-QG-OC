
let collectionGenerated = false;
let works = [];
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

function genererCollection(worksData) {
    works = worksData;
        if (!works || works.length ===0) {
            console.error("La collection est vide ou non définit");
            return
        }
    
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML="";
    
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

async function addWork(event) {
    event.preventDefault();
    const titleInput = document.getElementById("title");
    const categoryInput = document.getElementById("choix-cat");
    const ajoutFrame = document.getElementById("ajout-frame");
    const fileInput = document.getElementById("file");
    const title = titleInput.value;
    const imageUrl = ajoutFrame.querySelector("img").src;
    const userID = 1;

    const categories = await getCategories();


    const selectedCategory = categories.find(category => category.name === categoryInput.value);
    // C'est Ici qu'il faut coriger le tir !!!

    if(selectedCategory) {
        const categoryId = selectedCategory.id;
        const id = works.length > 0 ? works.length +1 : 1;
        const work = {
            "id" : id,
            "title" : title,
            "imageUrl" : imageUrl,
            "categoryID" : categoryId,
            "userID" : userID 
        };
        addToCollection(fileInput, title, categoryId);
        addToCollectionModal(work);
    } else {
        console.error("Catégorie non trouvée");
    }
   
}

async function addToCollection(fileInput, title, categoryId) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", title);
    formData.append("category", categoryId);
    try {
        const reponse = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Content': "multipart/form-data",
                'Authorization' : `Bearer ${token}`,
            },
            body: formData
        });
        if (!reponse.ok) {
            throw new Error('Echec de l\'ajout du nouveau projet');
        }
        const newWork = await reponse.json();
        addToCollectionData(newWork);
        genererCollection(works);
        addToCollectionModal(newWork);
    } catch (error) {
        console.error("Erreur dans l'ajout du projet", error.message);
    }
}

function addToCollectionData(newWork) {
    works.push(newWork);
}

function addToCollectionModal(work) {
    const galleryModal = document.querySelector(".galerie-modal")
    const img = new Image();
    img.src = work.imageUrl;
    galleryModal.appendChild(img);
    }

console.log(localStorage.getItem("token"))

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

// Affichage de l'aperçu du fichier a upload dans la modale 
const fileInput = document.getElementById("file");
fileInput.addEventListener("change", handleFileUpload);

const fileAdd = document.getElementById("valider");
fileAdd.addEventListener("click", function(event) {
    addWork(event);
    closeModal();
})

