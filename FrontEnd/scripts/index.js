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
  displayModalGallery();
  displayModalAdd();
  openAndCloseModal();

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
  const btnAddImg = document.querySelector(".btn-add-img");
  const modalAdd = document.getElementById("modal-add");
  const returnModal = document.getElementById("return");
  const closeModals = document.querySelectorAll(".fa-xmark");
  // Ouverture de la modal et modal-content
  modify.addEventListener("click", () => {
    modal.style.display = "flex";
    modalContent.style.display = "flex";
  });
  // Ouvrir la modal-add
  btnAddImg.addEventListener("click", () => {
    modalContent.style.display = "none";
    modalAdd.style.display = "flex";
  });
  // Fermeture de la modal-content & modal-add
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      modalContent.style.display = "none";
      modalAdd.style.display = "none";
    }
  });
  // Retour à la modal principale
  returnModal.addEventListener("click", () => {
    modalAdd.style.display = "none";
    modalContent.style.display = "flex";
  });
  // Fermeture de la modal
  closeModals.forEach((closeModal) => {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      modalContent.style.display = "none";
      modalAdd.style.display = "none";
    });
  });
}

function displayModalGallery() {
  const modalContent = document.getElementById("modal-content");
  const closeModalContent = document.createElement("i");
  closeModalContent.classList.add(
    "fa-solid",
    "fa-xmark",
    "close-modal-content"
  );
  const title = document.createElement("h3");
  title.innerText = "Galerie Photo";
  const divGallery = document.createElement("div");
  divGallery.classList.add("gallery-modal");
  const bottomLine = document.createElement("hr");
  const btnAddImg = document.createElement("button");
  btnAddImg.classList.add("btn-add-img");
  btnAddImg.innerText = "Ajouter une image";
  modalContent.appendChild(closeModalContent);
  modalContent.appendChild(title);
  modalContent.appendChild(divGallery);
  modalContent.appendChild(bottomLine);
  modalContent.appendChild(btnAddImg);
  // Ajout des images
  works.forEach((work) => {
    const worksId = work.id;
    const figure = document.createElement("figure");
    figure.classList.add(`figure-${worksId}`);
    const img = document.createElement("img");
    const elementTrash = document.createElement("i");
    elementTrash.classList.add("fa-solid", "fa-trash-can");
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
}

function displayModalAdd() {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.style.display = "none";
  const modalAdd = document.createElement("div");
  modalAdd.setAttribute("id", "modal-add");
  modalAdd.innerHTML = `
    <div class="return-and-exit">
      <i class="fa-solid fa-arrow-left" id="return"></i>
      <i class="fa-solid fa-xmark" id="close-modal-add"></i>
    </div>
    <form action="POST" id="form-add">
      <h3 class="title-add">Ajout photo</h3>
      <label for="input-add" class="label-add">
        <span class="icon-image"><i class="fa-solid fa-image"></i></span>
        <label for="input-add" class="label-input-add">+ Ajouter photo</label>
        <input type="file" name="add-image" id="input-add" />
        <span class="desc-add">jpeg, png : 4mo max</span>
      </label>
      <div class="div-input">
        <label for="input-title">Titre</label>
        <input type="text" id="input-title" placeholder="Entrer un titre...">
        <label for="select-category">Catégories</label>
        <select name="select-category" id="select-category">
          <option value="Selection" selected>Selectionner une catégorie...</option>
        </select>
        <hr class="bar-separator">
        <input type="submit" value="Valider" id="input-submit">
      </div>
    </form>
`;
  modal.appendChild(modalAdd);
  // Ajout des catégories
  const selectCategory = document.getElementById("select-category");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.innerText = category.name;
    selectCategory.appendChild(option);
  });

  const inputAdd = document.getElementById("input-add");
  const descAdd = document.querySelector(".desc-add");
  inputAdd.addEventListener("change", () => {
    const file = inputAdd.files;
    if (file.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          if (width > 1920 || height > 1080) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "L'image est trop grande !",
            });
            inputAdd.value = "";
          } else {
            descAdd.innerText = "Fichier valide !";
          }
        };
      };
      fileReader.readAsDataURL(file[0]);
    }
  });
}

// function createSecondModal() {
//   // Quand je clique sur le bouton "Ajouter une image"...

//   // ...je supprime le contenu de la modal...
//   const modalContent = document.getElementById("modal-content");
//   modalContent.innerHTML = "";
//   const modal = document.getElementById("modal");
//   const modalAddimg = document.createElement("div");
//   modalAddimg.setAttribute("id", "modal-add-img");
//   modal.appendChild(modalAddimg);

//   const returnModal = document.createElement("i");
//   returnModal.classList.add("fa-solid", "fa-arrow-left");

//   const closeModal = document.createElement("i");
//   closeModal.classList.add("fa-solid", "fa-xmark", "closeAddImg");

//   const title = document.createElement("h3");
//   title.innerText = "Ajouter une image";

//   // ...je crée un formulaire pour ajouter une image...
//   const form = document.createElement("form");
//   form.setAttribute("id", "formAddImg");

//   const labelIconInput = document.createElement("label");
//   labelIconInput.classList.add("label-icon-input");

//   const iconImg = document.createElement("i");
//   iconImg.classList.add("fa-regular", "fa-image");

//   const inputAdd = document.createElement("input");
//   inputAdd.setAttribute("id", "addImg");
//   inputAdd.setAttribute("type", "file");
//   inputAdd.setAttribute("accept", "image/*");
//   inputAdd.setAttribute("name", "addImg");

//   const btnAddImg = document.createElement("input");
//   btnAddImg.setAttribute("type", "button");
//   btnAddImg.setAttribute("id", "btn-add-img");
//   btnAddImg.value = "+ Ajouter photo";
//   btnAddImg.addEventListener("click", () => {
//     inputAdd.click();
//   });

//   const descAddImg = document.createElement("span");
//   descAddImg.classList.add("desc-add-img");
//   descAddImg.innerText = "jpeg, png : 4mo max";

//   const labelTitle = document.createElement("label");
//   labelTitle.setAttribute("for", "inputImgTitle");
//   labelTitle.classList.add("label-title");
//   labelTitle.innerText = "Titre";

//   const inputTitle = document.createElement("input");
//   inputTitle.setAttribute("type", "text");
//   inputTitle.setAttribute("id", "inputImgTitle");
//   inputTitle.setAttribute("placeholder", "Ajouter un titre...");

//   const labelCategory = document.createElement("label");
//   labelCategory.setAttribute("for", "selectCategory");
//   labelCategory.classList.add("label-category");
//   labelCategory.innerText = "Catégorie";

//   const selectCategory = document.createElement("select");
//   selectCategory.setAttribute("id", "selectCategory");

//   const optionSelect = document.createElement("option");
//   optionSelect.innerText = "Sélectionner une catégorie...";
//   optionSelect.setAttribute("selected", "selected");

//   const optionObjets = document.createElement("option");
//   optionObjets.setAttribute("value", "Objets");
//   optionObjets.innerText = "Objets";

//   const optionHotel = document.createElement("option");
//   optionHotel.setAttribute("value", "Hôtel & restaurant");
//   optionHotel.innerText = "Hôtel & restaurant";

//   const optionAppartement = document.createElement("option");
//   optionAppartement.setAttribute("value", "Appartement");
//   optionAppartement.innerText = "Appartement";

//   const separatorbar = document.createElement("hr");
//   separatorbar.setAttribute("id", "separatorbar");

//   const submitAddImg = document.createElement("input");
//   submitAddImg.setAttribute("type", "submit");
//   submitAddImg.setAttribute("value", "Ajouter");
//   submitAddImg.setAttribute("id", "submitAddImg");
//   // ...et je les ajoute à la modal
//   modal.appendChild(modalAddimg);
//   modalAddimg.appendChild(returnModal);
//   modalAddimg.appendChild(closeModal);
//   modalAddimg.appendChild(title);
//   modalAddimg.appendChild(form);
//   labelIconInput.appendChild(iconImg);
//   labelIconInput.appendChild(inputAdd);
//   labelIconInput.appendChild(btnAddImg);
//   labelIconInput.appendChild(descAddImg);
//   form.appendChild(labelIconInput);
//   form.appendChild(labelTitle);
//   form.appendChild(inputTitle);
//   form.appendChild(labelCategory);
//   form.appendChild(selectCategory);
//   selectCategory.appendChild(optionSelect);
//   selectCategory.appendChild(optionObjets);
//   selectCategory.appendChild(optionHotel);
//   selectCategory.appendChild(optionAppartement);
//   form.appendChild(separatorbar);
//   form.appendChild(submitAddImg);

//   // Fermeture de la modal
//   // Retour à la modal principale
//   returnModal.addEventListener("click", () => {
//     modalAddimg.style.display = "none";
//     displayModalGallery();
//   });
//   openAndCloseModal();
// }
