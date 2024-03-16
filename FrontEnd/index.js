// Gère les interactions sur la page index

fetch("http://localhost:5678/api/works")
.then ( works => works.json())
.then ( jsonListeWorks => {
    for (let jsonWrok of jsonListeWorks) {
        let Work = new Work(jsonWrok)
        document.querySelector(".gallery").innerHTML
    }
});