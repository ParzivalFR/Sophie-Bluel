// Récupération des Travaux
const fetchWorks = await fetch("http://localhost:5678/api/works");
const works = await fetchWorks.json();
window.localStorage.setItem("works", JSON.stringify(works));
const fetchCategories = await fetch("http://localhost:5678/api/categories");
const categories = await fetchCategories.json();
window.localStorage.setItem("categories", JSON.stringify(categories));

displayWorks(works);
displayBtnFilter();

// Affichage des travaux
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    figcaption.innerText = work.title;
    gallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
  });
}

// Affichage des boutons de filtre
function displayBtnFilter() {
  // Selection du parent
  const title = document.querySelector("#portfolio");
  const subTitle = title.children[1];
  const divBtn = document.createElement("div");
  divBtn.classList.add("divBtn");
  title.insertBefore(divBtn, subTitle);

  const gallery = document.querySelector(".gallery");
  const btnAll = document.createElement("button");
  btnAll.classList.add("btnAll");
  btnAll.innerText = "TOUS";
  divBtn.appendChild(btnAll);
  btnAll.addEventListener("click", () => {
    gallery.innerHTML = "";
    displayWorks(works);
  });
  // Création des bouton grâce à l'API
  categories.forEach((categorie) => {
    const buttons = document.createElement("button");
    buttons.innerText = categorie.name;
    buttons.classList.add(
      `btn${categorie.name.replace(/[^\w\s]/gi, "").replace(/\s+/g, "-")}`
    ); // Remplace les espaces par des tirets & supprime les caractères spéciaux
    buttons.addEventListener("click", () => {
      gallery.innerHTML = "";
      const filterWorks = works.filter(
        (work) => work.category.name === categorie.name
      );
      displayWorks(filterWorks);
    });
    divBtn.appendChild(buttons);
  });
}

const token = localStorage.getItem("token");

if (token) {
  const btnLogin = document.querySelector(".btn-login");
  btnLogin.innerText = "logout";
  btnLogin.style.fontWeight = "700";
  console.log("Vous êtes connecté");
  // Optionnelle
  btnLogin.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
