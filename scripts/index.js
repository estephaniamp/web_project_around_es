const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

const cardsContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-popup");
const closeEditProfileButton = editProfileModal.querySelector(".popup__close");

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editProfileForm = document.querySelector("#edit-profile-form");
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const descriptionInput = editProfileForm.querySelector(
  ".popup__input_type_description",
);

const addCardButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-popup");
const closeAddCardButton = addCardModal.querySelector(".popup__close");
const addCardForm = document.querySelector("#add-card-form");
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");

const imageModal = document.querySelector("#image-popup");
const imageModalPicture = imageModal.querySelector(".popup__image");
const imageModalCaption = imageModal.querySelector(".popup__caption");
const closeImageModalButton = imageModal.querySelector(".popup__close");

function openModal(modal) {
  modal.classList.add("popup_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
}

function fillProfileForm() {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
}

function handleOpenEditModal() {
  fillProfileForm();
  openModal(editProfileModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(editProfileModal);
}

function getCardElement(name, link) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    imageModalPicture.src = link;
    imageModalPicture.alt = name;
    imageModalCaption.textContent = name;
    openModal(imageModal);
  });

  return cardElement;
}

function renderCard(name, link) {
  const cardElement = getCardElement(name, link);
  cardsContainer.prepend(cardElement);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard(cardNameInput.value, cardLinkInput.value);
  addCardForm.reset();
  closeModal(addCardModal);
}

profileEditButton.addEventListener("click", handleOpenEditModal);
closeEditProfileButton.addEventListener("click", () =>
  closeModal(editProfileModal),
);
editProfileForm.addEventListener("submit", handleProfileFormSubmit);

addCardButton.addEventListener("click", () => openModal(addCardModal));
closeAddCardButton.addEventListener("click", () => closeModal(addCardModal));
addCardForm.addEventListener("submit", handleCardFormSubmit);

closeImageModalButton.addEventListener("click", () => closeModal(imageModal));

initialCards.forEach((card) => {
  renderCard(card.name, card.link);
});
