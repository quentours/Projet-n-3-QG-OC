
let collectionGenerated = false;
let works = [];
// Définition des fonctions

// Fonction d'ouverture de la modale

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
    
}

// Fonction pour générer la collection de miniatures dans la page 1 modale

function genererCollectionModal(works) {
    if (!works || works.length === 0) {
        console.error("La collection est vide ou non définit");
        return
    }
    const galleryModal = document.querySelector(".galerie-modale");

    for (let i=0 ; i< works.length; i++) {
        const vignette = works[i];
        const imageContainer = document.createElement("div");
        const imageVignette = document.createElement("img");

        const trashCanId = `${vignette.id}`;

        const trashCanAncor = document.createElement("a");
        trashCanAncor.href ="#";
        trashCanAncor.id = trashCanId;
        
        const trashCanIcon = document.createElement("i");
        trashCanIcon.classList.add("fas", "fa-trash-can");

        trashCanAncor.appendChild(trashCanIcon);            


        imageVignette.src = vignette.imageUrl;

        imageContainer.appendChild(imageVignette);
        imageContainer.appendChild(trashCanAncor);
        

        galleryModal.appendChild(imageContainer);

    }
}

// Fonction de fermeture de la modale

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

// fonction pour passer de page 1 modale vers page 2 modale

const slideModal = function() {
    const ajoutPhoto = document.getElementById("ajout-photo");
    const menuAjout = document.getElementById("menu-ajout");
    menuAjout.style.display = "none";
    ajoutPhoto.style.display = "flex";
}

// fonction pour passer de page 2 modale vers page 1 modale

const slideModalBack = function() {
    const ajoutPhoto = document.getElementById("ajout-photo");
    const menuAjout = document.getElementById("menu-ajout");
    menuAjout.style.display = "flex";
    ajoutPhoto.style.display = "none";
    }

// Récupération des catégories via l'API
    
 async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
        const categories = await reponse.json();
        return categories
}

// Obtention via l'API et création de la collection dans la div gallery

async function getCollection() {
    const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();
    
    genererCollection(works);
    }

// Création de la collection (fonction appelée dans getCollecetion)

async function genererCollection(worksData) {
    works = worksData;
        if (!works || works.length ===0) {
            console.error("La collection est vide ou non définit");
            return
        }
    
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML="";


    
        for (let i=0; i < works.length; i++) {
            const fiche = works[i];
            if (!fiche.categoryId) {
                console.error("Category is undefined for:", fiche);
                continue;
            } 
            const categoryId = parseInt(fiche.categoryId);
            const category = {id: categoryId, name: fiche.category};
            fiche.category= category;   
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
    
        }
    
}

// Gestion de l'affichage du formulaire lors de la selection d'une image sur le pc

function handleFileUpload(event) {
    const renderPicture = document.getElementById("render-picture");
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
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
        

        const title = document.getElementById("title").value
        const category = document.getElementById("choix-cat").value
        const imageUrl = renderPicture.querySelector("img").src
        inputValider = document.getElementById("valider");
            
        if(title && category && imageUrl) {
            inputValider.classList.add("ready-to-upload")
        } else {
            inputValider.classList.remove("ready-to-upload")
        }
    };
    reader.readAsDataURL(file);
}

// Gestion de l'ajout d'un nouveau projet (mise en forme pour l'ajout à la base de données et 
// appel des fonction addToCollection et resetForm())

async function addWork(event) {
    event.preventDefault();
    const titleInput = document.getElementById("title");
    const categoryInput = document.getElementById("choix-cat");
    const ajoutFrame = document.getElementById("ajout-frame");
    const fileInput = document.getElementById("file");
    const title = titleInput.value;
    const imageUrl = ajoutFrame.querySelector("img").src;
    const userID = 1;

    
        if(!title || !categoryInput.value || !imageUrl) {
            const errorMessage = "Merci de renseigner un titre, une catégorie et un fichier"
            console.error(errorMessage);
            alert(errorMessage);
            return;
        }
        

        try {
            const allWorksRequest = await fetch("http://localhost:5678/api/works");
            const allWorks = await allWorksRequest.json();

            const maxId = allWorks.reduce((max, work) => work.id > max ? work.id : max, 0);
            const newWorkId = maxId +1;
            
            const categories = await getCategories();
            const selectedCategory = categories.find(category => category.name === categoryInput.value);

            if(!selectedCategory) {
                throw new Error ("Merci de sélectionner une catégorie")
        }

        const categoryId = parseInt(selectedCategory.id);
        const categoryName = selectedCategory.name
       

        let work = {
            "id" : newWorkId,
            "title" : title,
            "imageUrl" : imageUrl,
            "categoryId" : categoryId,
            "category" :{
                "id": categoryId,
                "name": categoryName
            },
            "userID" : userID 
        };

        await addToCollection(fileInput, title, categoryId);

        resetForm();

    } catch (error) {
        console.error("Erreur dans l'ajout du projet, veuillez vérifier vos informations du formulaire", error.message);
    }
}

// fonction pour le reset du formulaire une fois un projet ajouté 

function resetForm() {
    const renderPicture = document.getElementById("render-picture");
    const inputFile = document.getElementById("file");
    const p1 = document.getElementById("p-frame1");
    const p2 = document.getElementById("p-frame2");
    const logo = document.getElementById("logo-ajout");

    renderPicture.innerHTML = "";

    inputFile.style.display = "flex";
    inputFile.style.zIndex = "3";
    p1.style.display = "block";
    p2.style.display = "flex";
    logo.style.display = "block";

    document.getElementById("title").value = "";
    document.getElementById("choix-cat").value = "";
    document.getElementById("file").value = "";

    renderPicture.classList.remove("render")
    

    const validerButton = document.getElementById("valider");
    validerButton.classList.remove("ready-to-upload");

}


// Ajout du nouveau projet à la base de données et mise à jour des collections

async function addToCollection(fileInput, title, categoryId) {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", title);
    formData.append("category", parseInt(categoryId));
    try {
        const reponse = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            mode: 'cors',
            headers: {

                'Authorization' : `Bearer ${token}`,
            },
            body: formData
            
        });
        if (!reponse.ok) {
            throw new Error('Echec de l\'ajout du nouveau projet');
        }
        const newWork = await reponse.json();
        await addToCollectionData(newWork);
        genererCollection(works);
        addToCollectionModal(newWork);
    } catch (error) {
        console.error("Erreur dans l'ajout du projet", error.message);
    }
}

async function addToCollectionData(newWork) {
    works.push(newWork);
}

// Mise à jour de la collection modale avec attribution de l'ID correspondante à celle de la base de données
// pour la supression éventuelle

async function addToCollectionModal(work) {
    const galleryModal = document.querySelector(".galerie-modale");
    const imageContainer = document.createElement("div");
    const imageVignette = document.createElement("img");
    const trashCanAncor = document.createElement("a");
    const trashCanIcon = document.createElement("i");

    const allWorksRequest = await fetch("http://localhost:5678/api/works");
            const allWorks = await allWorksRequest.json();

            const maxId = allWorks.reduce((max, work) => work.id > max ? work.id : max, 0);
            const vignetteId = maxId ;

    imageVignette.src = work.imageUrl;
    trashCanAncor.href = "#";
    trashCanIcon.classList.add("fas", "fa-trash-can");
    trashCanAncor.setAttribute(`id`, vignetteId)
    trashCanAncor.appendChild(trashCanIcon);

    imageContainer.appendChild(imageVignette);
    imageContainer.appendChild(trashCanAncor);

    galleryModal.appendChild(imageContainer);
}

// fonction pour la supression de projet

async function deleteProject(projectId) {
    try {
        const token = sessionStorage.getItem("token");
        const reponse = await fetch(`http://localhost:5678/api/works/${projectId}`,{
            method : "DELETE",
            headers: {
                "Content-Type" : "application/json",
                'Authorization' : `Bearer ${token}`
            }
        });

        if (!reponse.ok) {
            throw new Error("La supression du projet a échoué")
        }

        works = works.filter(work => work.id !== parseInt(projectId));
        
        updateGalleryAndModal();
    } catch (error) {
        console.error("Erreur dans la supression du projet:", error);
    }
}

// fonction pour la maj des deux galeries après la supression d'un projet.

function updateGalleryAndModal() {
    const galleryModal = document.querySelector(".galerie-modale");
    const gallery = document.querySelector(".gallery")
    galleryModal.innerHTML= "";
    gallery.innerHTML = "";

    getCollection(works);
    genererCollectionModal(works);
}

//  fonction pour vérifier les inputs dans le formulaire

function checkInputs() {
    const titleInputfield = document.getElementById("title");
    const categoryInputfield = document.getElementById("choix-cat");

    const title = titleInputfield.value;
    const category = categoryInputfield.value;
    const imageUrl = document.getElementById("render-picture").querySelector("img").src;
    const validerButton = document.getElementById("valider");

    if(title && category && imageUrl) {
        validerButton.classList.add("ready-to-upload");
    } else {
        validerButton.classList.remove("ready-to-upload")
    }
    
}

// Fonction pour reset l'état des boutons à la fermeture de la modale après avoir ajouter un projet
function resetSelectedButton() {
const boutonsTri = document.querySelectorAll(".bouton-de-tri button");
boutonsTri.forEach(button => button.classList.remove("selected"))
let boutonTous = document.querySelector(".btn-tous");
boutonTous.classList.add("selected");
}


// Gestion de la suppression de projet

document.addEventListener("click", async function(event) {
    if (event.target.matches(".fa-trash-can")) {
        const projectId = event.target.parentElement.id;
        await deleteProject(projectId);
    }
});



// Obtention des catégories et attribution à l'input select
const selectElement = document.getElementById("choix-cat");
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

const modeEditionButton = document.getElementById("btn-edition");
modeEditionButton.addEventListener("click", openModal);


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

// Retour vers la page 1 modale depuis la page 2 modale
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", slideModalBack);

// Affichage de l'aperçu du fichier a upload dans la modale 
const fileInput = document.getElementById("file");
fileInput.addEventListener("change", handleFileUpload);


// Ajout d'un nouveau projet au clic sur le bouton valider et retour sur la page 1 de la modale
// (Ajout conditionné par l'attribution de la classe ready-to-upload au bouton valider)
const fileAdd = document.getElementById("valider");
fileAdd.addEventListener("click", async function(event) {
    event.preventDefault();

    if(!this.classList.contains("ready-to-upload")) {
        console.log("Merci de remplir les champs du formulaires");
        alert("Merci de renseigner un titre, une categorie et une image");
        return;
    }

    try {
        await addWork(event);
        slideModalBack();
        resetSelectedButton();
    } catch (error) {
        console.error("Erreur dans l'ajout du nouveau projet", error.message);
        alert(error.message);
    }
})

// Passage de la classe CSS ready-to-upload au bouton valider lors du remplissage du dernier input du formulaire

const titleInputfield = document.getElementById("title");
const categoryInputfield = document.getElementById("choix-cat");
const fileInputfield = document.getElementById("file")

titleInputfield.addEventListener("input", checkInputs);
categoryInputfield.addEventListener("input", checkInputs);
