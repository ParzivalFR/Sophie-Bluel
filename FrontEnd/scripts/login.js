document.addEventListener("DOMContentLoaded", () => {
  const formlogin = document.querySelector("#form-login");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  formlogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const valueEmail = email.value.trim();
    const valuePassword = password.value.trim();

    if (valueEmail === "" || valuePassword === "") {
      const sectionLogin = document.querySelector(".login");
      const divErrorMsg = document.createElement("div");
      divErrorMsg.classList.add("div-error");
      const errorMsg = document.createElement("p");
      errorMsg.classList.add("error-msg");
      sectionLogin.appendChild(divErrorMsg);
      divErrorMsg.appendChild(errorMsg);

      errorMsg.innerText = "🔎 Veuillez remplir tous les champs !";

      sectionLogin.classList.add("shake-effect");

      // Suppression message après 5 secondes
      setTimeout(() => {
        divErrorMsg.remove();
      }, 5000);
    } else {
      const fetchUser = await fetch("http://localhost:5678/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valueEmail, valuePassword),
      }).then((user) => user.json());
    }
  });
});
