async function displayErrorLogin() {
  const sectionLogin = document.querySelector(".login");
  const divErrorMsg = document.createElement("div");
  divErrorMsg.classList.add("div-error");
  const errorMsg = document.createElement("p");
  errorMsg.classList.add("error-msg");
  sectionLogin.appendChild(divErrorMsg);
  divErrorMsg.appendChild(errorMsg);
  errorMsg.innerText = "🔎 Veuillez remplir tous les champs !";
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
      displayErrorLogin();
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
          email.value = "";
          password.value = "";
          window.location.href = "index.html";
        } else {
          displayErrorLogin();
        }
      } catch (error) {
        displayErrorLogin();
      }
    }
  }); // Ajoutez la parenthèse fermante ici
});
