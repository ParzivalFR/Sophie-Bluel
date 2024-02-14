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
    figure.classList.add(`figure-${work.id}`);
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
  console.log("🟢 Vous êtes connecté avec succès !");
  displayModeEdit();
  openAndCloseModal();
  displayModalGallery();

  // Optionnelle
  btnLogin.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

async function displayModeEdit() {
  // Suppression des boutons de filtre
  document.querySelector(".divBtn").remove();
  // Ajout d'un header pour le mode édition
  const header = document.querySelector("header");
  header.style.marginTop = "109px";
  const headerEdit = document.createElement("div");
  headerEdit.classList.add("header-edit");
  header.insertBefore(headerEdit, header.firstChild);
  const btnEdit = document.createElement("div");
  btnEdit.classList.add("btn-edit");
  btnEdit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> <p>Mode édition</p>`;
  headerEdit.appendChild(btnEdit);
  // Ajout d'un bouton pour ouvrir la modal
  const titlePortfolio = document.querySelector(".title-portfolio");
  const modify = document.createElement("a");
  modify.href = "#";
  modify.classList.add("modify");
  modify.innerHTML = `<i class="fa-solid fa-pen-to-square"><span>modifier</span></i>`;
  titlePortfolio.appendChild(modify);
}

function openAndCloseModal() {
  const modify = document.querySelector(".modify");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.createElement("i");
  closeModal.classList.add("fa-solid", "fa-xmark");
  modalContent.appendChild(closeModal);
  // Ouverture de la modal
  modify.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  // Fermeture de la modal
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target === closeModal) {
      modal.style.display = "none";
    }
  });
}

function displayModalGallery() {
  const modalContent = document.getElementById("modal-content");
  const title = document.createElement("h3");
  title.innerText = "Galerie Photo";
  const divGallery = document.createElement("div");
  divGallery.classList.add("gallery-modal");
  const bottomLine = document.createElement("hr");
  const btnAddImg = document.createElement("button");
  btnAddImg.classList.add("btn-add-img");
  btnAddImg.innerText = "Ajouter une image";
  modalContent.appendChild(title);
  modalContent.appendChild(divGallery);
  modalContent.appendChild(bottomLine);
  modalContent.appendChild(btnAddImg);
  // Ajout des images
  works.forEach((work) => {
    const worksId = work.id;
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const elementTrash = document.createElement("i");
    elementTrash.classList.add("fa-solid", "fa-trash-can");
    figure.classList.add(`figure-${worksId}`);
    img.src = work.imageUrl;
    divGallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(elementTrash);

    elementTrash.addEventListener("click", async (event) => {
      const confirmationResult = await Swal.fire({
        title: "Voulez-vous vraiment supprimer cette image ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      });

      if (confirmationResult.isConfirmed) {
        try {
          const fetchWorks = await fetch(
            `http://localhost:5678/api/works/${worksId}`,
            {
              method: "DELETE",
              headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (fetchWorks.ok) {
            document
              .querySelectorAll(`.figure-${worksId}`)
              .forEach((figure) => figure.remove());
            event.preventDefault();
            console.log("🗑️ Vous avez supprimé un travail !");
          } else {
            console.error(
              "Une erreur s'est produite lors de la suppression de l'image."
            );
          }
        } catch (error) {
          console.error(
            "Une erreur s'est produite lors de la suppression de l'image:",
            error
          );
        }
      } else {
        console.log("L'utilisateur a choisi 'Non' ou a annulé");
      }
    });
  });
  btnAddImg.addEventListener("click", () => {
    modalPushImg();
  });
}

function modalPushImg() {
  // Quand je clique sur le bouton "Ajouter une image"...

  // ...je supprime le contenu de la modal...
  const modalContent = document.getElementById("modal-content");
  modalContent.remove();
  const modal = document.getElementById("modal");
  const modalAddimg = document.createElement("div");
  modalAddimg.setAttribute("id", "modal-add-img");
  modal.appendChild(modalAddimg);
  // ...je crée un formulaire pour ajouter une image...
  const title = document.createElement("h3");
  title.innerText = "Ajouter une image";
  const form = document.createElement("form");
  form.setAttribute("id", "formAddImg");
  const labelIconInput = document.createElement("label");
  labelIconInput.classList.add("label-icon-input");
  const iconImg = document.createElement("i");
  iconImg.classList.add("fa-regular", "fa-image");
  const inputAdd = document.createElement("input");
  inputAdd.setAttribute("id", "addImg");
  inputAdd.setAttribute("type", "file");
  inputAdd.setAttribute("accept", "image/*");
  inputAdd.setAttribute("name", "addImg");
  const btnAddImg = document.createElement("input");
  btnAddImg.setAttribute("type", "button");
  btnAddImg.setAttribute("id", "btn-add-img");
  btnAddImg.value = "+ Ajouter photo";
  const descAddImg = document.createElement("p");
  descAddImg.classList.add("desc-add-img");
  descAddImg.innerText = "jpeg, png : 4mo max";
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "title");
  labelTitle.innerText = "Titre";
  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("id", "title");
  const labelCategory = document.createElement("label");
  labelCategory.setAttribute("for", "category");
  labelCategory.innerText = "Catégorie";
  const selectCategory = document.createElement("select");
  selectCategory.setAttribute("id", "category");
  const optionObjets = document.createElement("option");
  optionObjets.setAttribute("value", "Objets");
  optionObjets.innerText = "Objets";
  const optionHotel = document.createElement("option");
  optionHotel.setAttribute("value", "Hôtel & restaurant");
  optionHotel.innerText = "Hôtel & restaurant";
  const optionAppartement = document.createElement("option");
  optionAppartement.setAttribute("value", "Appartement");
  optionAppartement.innerText = "Appartement";
  const submitAddImg = document.createElement("input");
  submitAddImg.setAttribute("type", "submit");
  submitAddImg.setAttribute("value", "Ajouter");
  submitAddImg.setAttribute("id", "submitAddImg");
  // ...et je les ajoute à la modal
  modal.appendChild(modalAddimg);
  modalAddimg.appendChild(title);
  modalAddimg.appendChild(form);
  labelIconInput.appendChild(iconImg);
  labelIconInput.appendChild(inputAdd);
  labelIconInput.appendChild(btnAddImg);
  labelIconInput.appendChild(descAddImg);
  form.appendChild(labelIconInput);
  form.appendChild(labelTitle);
  form.appendChild(inputTitle);
  form.appendChild(labelCategory);
  form.appendChild(selectCategory);
  selectCategory.appendChild(optionObjets);
  selectCategory.appendChild(optionHotel);
  selectCategory.appendChild(optionAppartement);
}
