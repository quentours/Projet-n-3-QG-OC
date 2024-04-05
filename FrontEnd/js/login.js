document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const reponse = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { 
                    "Content-Type" : "application/json"},
                body : JSON.stringify({
                    email: email,
                    password : password
                })
            });

            if (!reponse.ok) {
                throw new Error("User Not Found");
            }

            const data = await reponse.json();
            const token = data.token;

            sessionStorage.setItem("token", token)

            window.location.href = "./index.html";
        } catch (error) {
            console.error("Error:", error.message);

            alert("Combinaison E-mail mot de passe incorecte.")
        }
    });
});


