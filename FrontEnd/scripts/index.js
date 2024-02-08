// Récupération des Travaux
fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((works) => {
    const allWorks = works;
    window.localStorage.setItem("works", JSON.stringify(allWorks));
    displayWorks(works);
  })
  .catch((error) => {
    console.error(`${error}`);
  });
// Récupération des Catégories
fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((categories) => {
    const allCategories = categories;
    window.localStorage.setItem("categories", JSON.stringify(allCategories));
    displayBtnFilter(categories);
  })
  .catch((error) => {
    console.error(`${error}`);
  });

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
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

function displayBtnFilter(categories) {
  // Selection du parent
  const title = document.querySelector("#portfolio");
  const subTitle = title.children[1];
  const divBtn = document.createElement("div");
  divBtn.classList.add("divBtn");
  title.insertBefore(divBtn, subTitle);

  const btnAll = document.createElement("button");
  btnAll.classList.add("btn-all");
  btnAll.innerText = "TOUS";
  divBtn.appendChild(btnAll);
  // Création des bouton grâce à l'API
  categories.forEach((categorie) => {
    const buttons = document.createElement("button");
    buttons.innerText = categorie.name;
    buttons.classList.add(`btn-${categorie.name.replace(/\s+/g, "-")}`); // Remplace les espaces par des tirets
    divBtn.appendChild(buttons);
  });
}
