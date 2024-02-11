async function displayErrorLogin(msg) {
  const sectionLogin = document.querySelector(".login");
  const divErrorMsg = document.createElement("div");
  divErrorMsg.classList.add("div-msg", "div-error");
  const errorMsg = document.createElement("p");
  errorMsg.classList.add("error-msg");
  sectionLogin.appendChild(divErrorMsg);
  divErrorMsg.appendChild(errorMsg);
  errorMsg.innerText = msg;
  // Suppression du message après 5 secondes
  setTimeout(() => {
    divErrorMsg.remove();
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  const formlogin = document.querySelector("#form-login");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  formlogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const valueEmail = email.value.trim();
    const valuePassword = password.value.trim();

    if (valueEmail === "" || valuePassword === "") {
      displayErrorLogin("🔎 Veuillez remplir tous les champs !");
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
          // Message de confirmation + 3 secs de délais avant redirection
          displayErrorLogin("🟢 Vous êtes connecté avec succès !");
          const divMsg = document.querySelector(".div-msg");
          divMsg.classList.remove("div-error");
          divMsg.classList.add("div-confirm");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 3000);
        } else {
          displayErrorLogin("🔎 Adresse mail et/ou mot de passe incorrect !");
        }
      } catch (error) {
        displayErrorLogin(error);
      }
    }
  }); // Ajoutez la parenthèse fermante ici
});
