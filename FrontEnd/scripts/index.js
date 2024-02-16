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
      toggleButtonColor();
      gallery.innerHTML = "";
      const filterWorks = works.filter(
        (work) => work.category.name === categorie.name
      );
      displayWorks(filterWorks);
    });
    divBtn.appendChild(buttons);
  });
}

function toggleButtonColor() {
  // Sélectionnez tous les boutons dans la divBtn
  const buttons = document.querySelectorAll(".divBtn button");
  // Parcourez tous les boutons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Supprimez la classe 'active' de tous les boutons
      buttons.forEach((btn) => btn.classList.remove("active"));
      // Ajoutez la classe 'active' uniquement au bouton cliqué
      button.classList.add("active");
    });
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
  postNewWork();

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
  <form action="/upload" method="post" id="form-add">
     <h3 class="title-add">Ajout photo</h3>
     <label for="input-add" class="label-add">
       <img src="" alt="image upload" class="img-preview">
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
         <option value="" disabled selected>Sélectionner la catégorie...</option>
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
}

function postNewWork() {
  const inputAdd = document.getElementById("input-add");
  inputAdd.addEventListener("change", () => {
    const file = inputAdd.files[0];
    if (file && file.size <= 4000000) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imgPreview = document.querySelector(".img-preview");
        const iconImage = document.querySelector(".icon-image");
        const labelInputAdd = document.querySelector(".label-input-add");
        const descAdd = document.querySelector(".desc-add");

        iconImage.style.display = "none";
        inputAdd.style.display = "none";
        labelInputAdd.style.display = "none";
        descAdd.style.display = "none";

        imgPreview.src = fileReader.result;
        imgPreview.style.display = "flex";
        descAdd.innerText = `Image validée : ${file.name}`;
      };
      fileReader.readAsDataURL(file);
    } else if (file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "L'image devrait se mettre au régime... 🍔🥤",
      });
      inputAdd.value = "";
    }
  });
  // Envoi du formulaire
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  const inputSubmit = document.getElementById("input-submit");
  inputSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    if (
      inputAdd.value === "" ||
      inputTitle.value === "" ||
      selectCategory.value === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Je crois que vous avez oublié quelque chose... 🤔",
      });
    } else {
      const formData = new FormData();
      formData.append("image", inputAdd.files[0]);
      formData.append("title", inputTitle.value);
      formData.append("category", selectCategory.value);
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Bravo !",
          text: "Votre travail a bien été ajouté ! 🎉",
        });
        const newWork = await response.json();
        // Réinitialisation de l'input Add & champs
        resetInputAdd();
        // Ajout du travail dans la galerie
        addWorksGallery(newWork);
        // Ajout de l'image dans la galerie modal
        addImgModalGallery(newWork);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Une erreur s'est produite lors de l'ajout de votre travail... 😔",
        });
      }
    }
  });
}

function resetInputAdd() {
  // Réinitialisation de l'input Add
  const imgPreview = document.querySelector(".img-preview");
  const iconImage = document.querySelector(".icon-image");
  const labelInputAdd = document.querySelector(".label-input-add");
  const descAdd = document.querySelector(".desc-add");
  const inputAdd = document.getElementById("input-add");
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  imgPreview.style.display = "none";
  iconImage.style.display = "flex";
  labelInputAdd.style.display = "flex";
  descAdd.style.display = "flex";
  // Réinitialisation des champs
  inputAdd.value = "";
  inputTitle.value = "";
  selectCategory.value = "";
}

async function addWorksGallery(newWork) {
  // Ajout du travail dans la galerie
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  figure.classList.add(`figure-${newWork.id}`);
  img.src = newWork.imageUrl;
  figcaption.innerText = newWork.title;
  gallery.appendChild(figure);
  figure.appendChild(img);
  figure.appendChild(figcaption);
}

async function addImgModalGallery(newWork) {
  // Ajout de l'image dans la galerie modal
  const divGallery = document.querySelector(".gallery-modal");
  const figureModal = document.createElement("figure");
  figureModal.classList.add(`figure-${newWork.id}`);
  const imgModal = document.createElement("img");
  const elementTrash = document.createElement("i");
  elementTrash.classList.add("fa-solid", "fa-trash-can");
  imgModal.src = newWork.imageUrl;
  divGallery.appendChild(figureModal);
  figureModal.appendChild(imgModal);
  figureModal.appendChild(elementTrash);
}
