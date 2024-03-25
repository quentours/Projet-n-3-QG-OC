const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "block";
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    const sectionAjout = document.getElementById("ajout-photo")
    sectionAjout.style.display = "none"
    document.body.classList.add("modal-open")
    // penser à ajouter le classlist.remove pour la fermture de la modale

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
    getCollectionModal();
}    

const btnAjout = document.getElementById("btn-modifier");
btnAjout.addEventListener("click", openModal)

