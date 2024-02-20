// Chargement de la page login.html
document.addEventListener("DOMContentLoaded", () => {
  const formlogin = document.querySelector("#form-login");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  // Soumission du formulaire de connexion
  formlogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    // utilisation de Trim() pour ne pas tenir compte des espaces avant et après les valeurs saisies
    // Utilisation de ToLowerCase() pour ne pas tenir compte des majuscules dans l'adresse mail
    const valueEmail = email.value.trim().toLowerCase();
    const valuePassword = password.value.trim();
    // Vérification des champs vides et affichage d'un message d'erreur
    if (valueEmail === "" || valuePassword === "") {
      email.value = "";
      password.value = "";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "🔎 Veuillez remplir tous les champs !",
      });
    } else {
      try {
        const fetchUser = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: valueEmail, password: valuePassword }),
        });
        if (fetchUser.ok) {
          const user = await fetchUser.json();
          localStorage.setItem("token", user.token);
          // Suppression du message après 3 secondes
          email.value = "";
          password.value = "";
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Connecté avec succès !",
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.href = "index.html";
          }, 3000);
        } else {
          email.value = "";
          password.value = "";
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "🔎 Adresse mail et/ou mot de passe incorrect !",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error}`,
        });
      }
    }
  });
});
